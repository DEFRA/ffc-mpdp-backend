const Hapi = require('@hapi/hapi')
const config = require('./config')
const catbox = config.get('cache.useRedis') ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
const catboxOptions = config.get('cache.useRedis') ? config.get('cache.catbox') : {}
const cache = require('./cache')

async function createServer () {
  const server = Hapi.server({
    host: config.get('server.host'),
    port: config.get('server.port'),
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
