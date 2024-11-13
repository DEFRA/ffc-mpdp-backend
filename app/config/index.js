const convict = require('convict')
const serverConfig = require('./server')
const dbConfig = require('./database')
const cacheConfig = require('./cache')

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  isProd: {
    doc: 'True if the application is in production mode',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  server: serverConfig.getProperties(),
  db: dbConfig.getProperties(),
  cache: cacheConfig.getProperties()
})

config.validate({ allowed: 'strict' })

module.exports = config
