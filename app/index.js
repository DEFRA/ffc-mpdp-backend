const server = require('./server')
const db = require('./data')

const init = async () => {
  await server.start()
  console.log('Server running on %s', server.info.uri)
  const examples = await db.example.findAll()
  console.table(examples)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
