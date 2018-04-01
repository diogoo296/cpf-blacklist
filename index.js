const Hapi = require('hapi')
const moment = require('moment')

const routes = require('./api/routes')

const init = async () => {
  const server = new Hapi.Server({
    port: 3000,
    routes: {
      cors: true,
      // Should be used only in development (see: https://github.com/hapijs/hapi/issues/3706)
      validate: {
        failAction: async (request, h, err) => { throw err }
      }
    }
  })

  // Register plugins
  let plugins = [
    require('inert'),
    require('vision'),
    require('hapi-qs'),
    require('./plugins/swagger'),
    { plugin: require('./plugins/request_counter'), options: { routes: routes } }
  ]
  if (process.env.NODE_ENV !== 'test') plugins.push(require('./plugins/good'))
  await server.register(plugins)

  // Register default route: Swagger documentation
  server.route({
    path: '/',
    method: 'GET',
    handler: (request, h) => h.redirect(require('./package.json').docPath)
  })

  // Register API routes & controllers
  server.route(routes)

  await server.start()
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${moment().format()}], Server running at ${server.info.uri}`)
  }

  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

module.exports = init()
