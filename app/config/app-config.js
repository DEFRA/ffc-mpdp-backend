const databaseConfig = require('./database-config')
const { environments } = require('./constants')

const value = {
  database: databaseConfig,
  isDev: process.env.NODE_ENV === environments.development,
  isProd: process.env.NODE_ENV === environments.production,
  env: process.env.NODE_ENV || environments.development
}
module.exports = value
