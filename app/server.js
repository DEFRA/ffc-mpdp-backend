const Hapi = require('@hapi/hapi')
const Joi = require('joi')
const config = require('./config')
const Catbox = config.get('cache.useRedis') ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
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
        constructor: Catbox.Engine,
        options: catboxOptions
      }
    }]
  })

  server.validator(Joi)

  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/errors'))

  cache.setup(server)

  const routes = [].concat(
    require('./routes/health'),
    require('./routes/payments-file'),
    require('./routes/payments'),
    require('./routes/payments-payee'),
    require('./routes/payments-search'),
    require('./routes/payments-summary')
  )
  server.route(routes)

  return server
}

module.exports = { createServer }
