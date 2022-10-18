require('./insights').setup()
const Hapi = require('@hapi/hapi')

const startServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT
  })

  // Required for handling static files
  await server.register(require('@hapi/inert'));

  const routes = [].concat(
    require('./routes/healthy'),
    require('./routes/healthz'),
    require('./routes/downloadall')
  )

  server.route(routes)
  await server.start()
  // console.log('Server running on %s', server.info.uri)
  return server;
}

module.exports = startServer
