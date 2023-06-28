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
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/errors'))

  process.on('SIGTERM', async function () {
    process.exit(0)
  })

  process.on('SIGINT', async function () {
    process.exit(0)
  })

  const routes = [].concat(
    require('./routes/healthy'),
    require('./routes/healthz'),
    require('./routes/downloadall'),
    require('./routes/paymentdata'),
    require('./routes/paymentdetail'),
    require('./routes/searchsuggestion'),
    require('./routes/downloaddetails'),
    require('./routes/schemePaymentsByYear')
  )
  server.route(routes)

  return server
}

module.exports = createServer
