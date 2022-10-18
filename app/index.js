const startServer = require('./server')


const init = async () => {
  await startServer()
  }

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
