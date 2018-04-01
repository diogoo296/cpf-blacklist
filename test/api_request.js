const _ = require('lodash')
const querystr = require('querystring')

module.exports = class Request {
  constructor (method, endpoint = '') {
    this.parameters = {
      method: method,
      url: endpoint,
      headers: { Accept: 'application/json' }
    }
  }

  buildOpts (options = {}) {
    let parameters = _.clone(this.parameters)
    if (options.payload) parameters.payload = options.payload
    if (options.query) parameters.url += `?${querystr.stringify(options.query)}`
    if (options.url) parameters.url += options.url

    return parameters
  }
}
