const Hapi = require('@hapi/hapi')
const Joi = require('joi')
const config = require('./config')
const cache = require('./cache')
const { registerPlugins } = require('./plugins')

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
    router: {
      stripTrailingSlash: true
    },
    cache: [cache.getProvider()]
  })

  cache.setup(server)
  server.validator(Joi)
  await registerPlugins(server)

  return server
}

module.exports = { createServer }
