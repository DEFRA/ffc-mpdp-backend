require('./insights').setup()
const Hapi = require('@hapi/hapi')
const config = require('./config/appConfig')
const catbox = config.useRedis ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
const catboxOptions = config.useRedis ? config.cacheConfig.redisCatboxOptions : {}
const cache = require('./cache')

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
    },
    cache: [{
      provider: {
        constructor: catbox,
        options: catboxOptions
      }
    }]
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/errors'))

  cache.setup(server)

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
    require('./routes/schemePaymentsByYear'),
    require('./routes/downloadPaymentsByYearSummary')
  )
  server.route(routes)

  return server
}

module.exports = createServer
