const createServer = require('./server')
const databaseConfig = require('./config/database-config')
const { environments } = require('./config/constants')

createServer()
  .then(server => server.start())
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

const value = {
  database: databaseConfig,
  isDev: process.env.NODE_ENV === environments.development,
  isProd: process.env.NODE_ENV === environments.production,
  env: process.env.NODE_ENV || environments.development
}

module.exports = value
