class RequestCounter {
  constructor (routes) {
    // Verify routes object
    if (!routes || !Array.isArray(routes)) {
      throw Error('Options object should have a routes Array')
    }

    // Initialize server request counter
    this.counter = routes.reduce(
      (dict, route) => {
        if (!(route.path in dict)) dict[route.path] = {}
        dict[route.path][route.method.toUpperCase()] = 0
        return dict
      },
      { total: 0 }
    )
  }

  onRequest (request, h) {
    const method = request.method.toUpperCase()

    if (request && this.counter[request.path] &&
        method in this.counter[request.path]) {
      this.counter[request.path][method]++
      this.counter.total++
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
