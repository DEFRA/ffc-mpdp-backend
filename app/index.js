const server = require('./server')

const init = async () => {
  // TODO move this registration to server.js once the code base migrated to typescript
  await server.register(require('@hapi/inert'))
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
