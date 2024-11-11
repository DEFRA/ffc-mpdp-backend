require('./insights').setup()
const Hapi = require('@hapi/hapi')
const config = require('./config/app')
const catbox = config.useRedis ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
const catboxOptions = config.useRedis ? config.cacheConfig.redisCatboxOptions : {}
const cache = require('./cache')

async function createServer () {
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
    require('./routes/health'),
    require('./routes/download-all'),
    require('./routes/payment-data'),
    require('./routes/payment-detail'),
    require('./routes/search-suggestion'),
    require('./routes/download-details'),
    require('./routes/scheme-payments-by-year'),
    require('./routes/download-payments-by-year-summary')
  )
  server.route(routes)

  return server
}

module.exports = createServer
