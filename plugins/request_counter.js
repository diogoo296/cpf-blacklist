class RequestCounter {
  constructor (routes) {
    if (!routes) throw Error('Options object should have a routes Array')

    // Initialize server request counter
    this.counter = routes.reduce(
      (dict, route) => {
        if (!(route.path in dict)) dict[route.path] = {}
        dict[route.path][route.method.toUpperCase()] = 0
        return dict
      },
      {}
    )
  }

  onRequest (request, h) {
    if (request && this.counter[request.path]) {
      this.counter[request.path][request.method.toUpperCase()]++
      request.server.counter = this.counter
    }

    return h.continue
  }
}

module.exports = {
  name: 'requestCounter',

  version: '1.0.0',

  register: async (server, options) => {
    const reqCounter = new RequestCounter(options.routes)
    server.ext('onRequest', (request, h) => reqCounter.onRequest(request, h))
  }
}
