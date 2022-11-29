const createServer = require('./server')

async function startServer () {
  const server = await createServer()
  server.start()
  return server
}
startServer()
