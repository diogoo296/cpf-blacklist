const moment = require('moment')
const expect = require('chai').expect

const ApiRequest = require('../api_request')
const Blacklist = require('../../models').Blacklist

describe('controllers', function () {
  let server
  let apiRequest

  before(async function () {
    server = await require('../../')
  })

  beforeEach(function () {
    return Blacklist.truncate()
  })

  describe('GET /status', function () {
    before(function () {
      apiRequest = new ApiRequest('GET', '/status')
    })

    it('should return an accurate requests count', async function () {
      const requestOpts = (url) => (new ApiRequest('GET', url)).buildOpts()

      await server.inject(requestOpts('/query')) // Bad request
      await server.inject(requestOpts('/invalidRoute')) // Non-existent route
      await server.inject(requestOpts('/status')) // 200 OK
      const response = await server.inject(apiRequest.buildOpts())

      expect(response.statusCode).to.be.equal(200)

      const requests = response.result.requests
      expect(requests).to.be.deep.equal({
        total: 3,
        '/status': { GET: 2 },
        '/query': { GET: 1 },
        '/block': { POST: 0 },
        '/free': { POST: 0 }
      })
    })

    it('should return an accurate server status', async function () {
      const response = await server.inject(apiRequest.buildOpts())

      const formatDate = (timestampMs) => {
        return moment.unix(timestampMs / 1000).format()
      }

      expect(response.statusCode).to.be.equal(200)

      const body = response.result.server
      const info = server.info

      expect(body.created).to.be.equal(formatDate(info.created))
      expect(body.started).to.be.equal(formatDate(info.started))
      expect(body.uptime).to.match(/\d\d:\d\d:\d\d/)
    })

    it('should return an empty blacklist', async function () {
      const response = await server.inject(apiRequest.buildOpts())

      expect(response.statusCode).to.be.equal(200)

      const blacklist = response.result.blacklist
      expect(blacklist.length).to.be.equal(0)
    })

    it('should return blacklist with 2 elements', async function () {
      await Blacklist.bulkCreate([
        { cpf: '25158445532' },
        { cpf: '59329473490' },
        { cpf: '62608426603' }
      ])
      await Blacklist.destroy({ where: { cpf: '62608426603' } })

      const response = await server.inject(apiRequest.buildOpts())

      expect(response.statusCode).to.be.equal(200)

      const blacklist = response.result.blacklist
      expect(blacklist).to.be.deep.equal(['25158445532', '59329473490'])
    })
  })

  describe('GET /query', function () {
    before(function () {
      apiRequest = new ApiRequest('GET', '/query')
    })

    it('should return FREE', async function () {
      const response = await server.inject(
        apiRequest.buildOpts({ query: { cpf: '25158445532' } })
      )

      expect(response.statusCode).to.be.equal(200)
      expect(response.result.status).to.be.equal('FREE')
    })

    it('should return BLOCKED', async function () {
      await Blacklist.create({ cpf: '25158445532' })
      const response = await server.inject(
        apiRequest.buildOpts({ query: { cpf: '25158445532' } })
      )

      expect(response.statusCode).to.be.equal(200)
      expect(response.result.status).to.be.equal('BLOCKED')
    })
  })

  describe('POST /block', function () {
    before(function () {
      apiRequest = new ApiRequest('POST', '/block')
    })

    it('should not block a CPF already in the Blacklist', async function () {
      await Blacklist.create({ cpf: '25158445532' })
      const response = await server.inject(
        apiRequest.buildOpts({ payload: { cpf: '25158445532' } })
      )

      expect(response.statusCode).to.be.equal(403)
      expect(response.result.message).to.be.equal('CPF is already in the Blacklist')
    })

    it('should block a free CPF', async function () {
      const response = await server.inject(
        apiRequest.buildOpts({ payload: { cpf: '25158445532' } })
      )

      expect(response.statusCode).to.be.equal(200)
      expect(response.result).to.have.keys('id', 'cpf', 'createdAt')
      expect(response.result.cpf).to.be.equal('25158445532')
    })
  })

  describe('POST /free', function () {
    before(function () {
      apiRequest = new ApiRequest('POST', '/free')
    })

    it('should not free a CPF already free', async function () {
      const response = await server.inject(
        apiRequest.buildOpts({ payload: { cpf: '25158445532' } })
      )

      expect(response.statusCode).to.be.equal(403)
      expect(response.result.message).to.be.equal('CPF is already free')
    })

    it('should free a CPF in the Blacklist', async function () {
      await Blacklist.create({ cpf: '25158445532' })
      const response = await server.inject(
        apiRequest.buildOpts({ payload: { cpf: '25158445532' } })
      )

      expect(response.statusCode).to.be.equal(200)
      expect(response.result).to.have.keys('id', 'cpf', 'createdAt')
      expect(response.result.cpf).to.be.equal('25158445532')
    })
  })
})
