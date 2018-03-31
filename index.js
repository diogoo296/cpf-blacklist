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
    require('./plugins/swagger'),
    { plugin: require('./plugins/request_counter'), options: { routes: routes } }
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

  await server.start()
  console.log(`[${moment().format()}], Server running at ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
