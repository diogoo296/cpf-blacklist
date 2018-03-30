const moment = require('moment')

const CPF_LEN = 11

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

  block: (request, h) => true,

  free: (request, h) => true,

  cpfIsValid: (request, h) => {
    // Transform CPF string to an integer array
    const cpfArr = request.query.cpf.split('').map(Number)
    const lastDigit = cpfArr[cpfArr.length - 1]
    let multiplier = CPF_LEN

    // Calculate CPF sum to check with last digit
    const sum = cpfArr
      .slice(0, -1)
      .reduce(
        (acc, cur) => {
          acc += cur * multiplier
          multiplier--
          return acc
        },
        0
      )

    const reminder = sum % 11

    if ([0, 1].includes(reminder)) return lastDigit === 0
    else return lastDigit === CPF_LEN - reminder
  }
}

const formatUnixMs = (timestamp) => moment.unix(timestamp / 1000).format()
