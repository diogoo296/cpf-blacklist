const Hapi = require('hapi')
const moment = require('moment')

const routes = require('./api/routes')

const server = new Hapi.Server({
  port: 3000, routes: { cors: true }
})

const init = async () => {
  // Register plugins
  await server.register([
    require('inert'),
    require('vision'),
    require('hapi-qs'),
    require('./plugins/good'),
    require('./plugins/swagger')
  ])

  // Register default route: Swagger documentation
  server.route({
    path: '/',
    method: 'GET',
    handler: (request, h) => h.redirect(require('./package.json').docPath),
    config: { auth: false }
  })

  // Register API routes & controllers
  server.route(routes)

  // Initialize server request counter
  server.counter = routes.reduce(
    (dict, route) => {
      if (!(route.path in dict)) dict[route.path] = {}
      dict[route.path][route.method.toUpperCase()] = 0
      return dict
    },
    {}
  )

  // Request counter
  server.events.on('response', (request) => {
    if (!request) return
    request.server.counter[request.path][request.method.toUpperCase()]++
  })

  await server.start()
  console.log(`[${moment().format()}], Server running at ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
