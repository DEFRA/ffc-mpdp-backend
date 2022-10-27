require('./insights').setup()
const Hapi = require('@hapi/hapi')

async function createServer () {
  // Create the hapi server
  const server = Hapi.server({
    port: process.env.PORT,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))

  process.on('SIGTERM', async function () {
    process.exit(0)
  })

  process.on('SIGINT', async function () {
    process.exit(0)
  })

  const routes = [].concat(
    require('./routes/healthy'),
    require('./routes/healthz'),
    require('./routes/downloadall')
  )
  server.route(routes)

  return server
}

module.exports = createServer
