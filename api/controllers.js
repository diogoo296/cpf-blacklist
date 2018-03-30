const moment = require('moment')

module.exports = {
  status: (request, h) => {
    const info = request.server.info

    return {
      server: {
        created: formatUnixMs(info.created),
        started: formatUnixMs(info.started),
        uptime: moment.utc(moment().unix() * 1000 - info.started).format('HH:mm:ss')
      },
      requests: request.server.counter
    }
  },

  verifyCpf: (request, h) => true,

  blacklist: (request, h) => true,

  valid: (request, h) => true
}

const formatUnixMs = (timestamp) => moment.unix(timestamp / 1000).format()
