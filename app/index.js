const { setup: setupAppInsights } = require('./insights')
const { createServer } = require('./server')

async function startServer () {
  setupAppInsights()
  const server = await createServer()
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

module.exports = { startServer }

if (require.main === module) {
  startServer()
}
