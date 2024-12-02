const logging = require('./logging')
const router = require('./router')

async function registerPlugins (server) {
  const plugins = [
    logging,
    router
  ]

  await server.register(plugins)
}

module.exports = { registerPlugins }
