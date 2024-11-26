const logging = require('./logging')
const errors = require('./errors')
const router = require('./router')

async function registerPlugins (server) {
  const plugins = [
    logging,
    errors,
    router
  ]

  await server.register(plugins)
}

module.exports = { registerPlugins }
