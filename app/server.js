const Hapi = require('@hapi/hapi')
const config = require('./config/app')
const catbox = config.useRedis ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
const catboxOptions = config.useRedis ? config.cacheConfig.redisCatboxOptions : {}
const cache = require('./cache')

async function createServer () {
  const server = Hapi.server({
    host: process.env.HOST || '0.0.0.0',
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
    require('./routes/payments-file'),
    require('./routes/payments'),
    require('./routes/payments-payee'),
    require('./routes/payments-search'),
    require('./routes/payments-payee-file'),
    require('./routes/payments-summary'),
    require('./routes/payments-summary-file')
  )
  server.route(routes)

  return server
}

module.exports = { createServer }
