const { setupAppInsights } = require('./insights')
const { createServer } = require('./server')

async function startServer () {
  setupAppInsights()
  const server = await createServer()
  await server.start()
}

module.exports = { startServer }

if (require.main === module) {
  startServer()
}
