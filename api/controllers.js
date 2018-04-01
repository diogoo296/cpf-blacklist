const Boom = require('boom')
const moment = require('moment')

const Blacklist = require('../models').Blacklist

module.exports = {
  status: async (request, h) => {
    const info = request.server.info

    return {
      server: {
        created: formatUnixMs(info.created),
        started: formatUnixMs(info.started),
        uptime: moment.utc(moment().unix() * 1000 - info.started).format('HH:mm:ss')
      },
      requests: request.server.counter,
      blacklist: await Blacklist
        .all({ attributes: ['cpf'], raw: true })
        .map((item) => item.cpf)
    }
  },

  query: async (request, h) => {
    return {
      status: await Blacklist.findCpfNumber(request.query.cpf)
        ? 'BLOCKED' : 'FREE'
    }
  },

  block: async (request, h) => {
    const cpf = request.payload.cpf
    return await Blacklist.findCpfNumber(cpf)
      ? Boom.forbidden('CPF is already in the Blacklist')
      : (await Blacklist.create({ cpf: cpf })).toJSON()
  },

  free: async (request, h) => {
    const cpf = request.payload.cpf
    let cpfBlacklisted = await Blacklist.findCpfNumber(cpf)

    return cpfBlacklisted
      ? (await cpfBlacklisted.destroy()).toJSON()
      : Boom.forbidden('CPF is already free')
  }
}

const formatUnixMs = (timestamp) => moment.unix(timestamp / 1000).format()
