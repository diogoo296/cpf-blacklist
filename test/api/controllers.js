const moment = require('moment')
const expect = require('chai').expect

const requestOpts = (method, url, data = {}) => Object.assign(
  { method: method, url: url, headers: { Accept: 'application/json' } },
  data
)

describe('controllers', function () {
  let server

  before(async function () {
    server = await require('../../')
  })

  describe('GET /status', function () {
    it('should return an accurate requests count', async function () {
      await server.inject(requestOpts('GET', '/consulta')) // Bad request
      await server.inject(requestOpts('GET', '/invalidRoute')) // Non-existent route
      await server.inject(requestOpts('GET', '/status')) // 200 OK
      const response = await server.inject(requestOpts('GET', '/status'))

      expect(response.statusCode).to.be.equal(200)

      const requests = JSON.parse(response.payload).requests
      expect(requests).to.be.deep.equal({
        total: 3,
        '/status': { GET: 2 },
        '/consulta': { GET: 1 },
        '/block': { POST: 0 },
        '/free': { POST: 0 }
      })
    })

    it('should return an accurate server status', async function () {
      const response = await server.inject(requestOpts('GET', '/status'))

      const formatDate = (timestampMs) => {
        return moment.unix(timestampMs / 1000).format()
      }

      expect(response.statusCode).to.be.equal(200)

      const body = JSON.parse(response.payload)
      const info = server.info

      expect(body.server.created).to.be.equal(formatDate(info.created))
      expect(body.server.started).to.be.equal(formatDate(info.started))
      expect(body.server.uptime).to.match(/\d\d:\d\d:\d\d/)
    })

    it.skip('should return the CPF blacklist', async function () {
      const response = await server.inject(requestOpts('GET', '/status'))

      expect(response.statusCode).to.be.equal(200)
    })
  })
})
