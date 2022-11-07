const createServer = require('./server')
const databaseConfig = require('./config/database-config')
const { environments } = require('./config/constants')



const value = {
  database: databaseConfig,
  isDev: process.env.NODE_ENV === environments.development,
  isProd: process.env.NODE_ENV === environments.production,
  env: process.env.NODE_ENV || environments.development
}

createServer()
  .then(server => server.start())
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
  
module.exports = value
