const databaseConfig = require('./databaseConfig')
const { environments } = require('./constants')

const config = {
  database: databaseConfig,
  isDev: process.env.NODE_ENV === environments.development,
  isProd: process.env.NODE_ENV === environments.production,
  env: process.env.NODE_ENV || environments.development,
  search: {
    fieldsToExtract: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme'],
    fields: ['payee_name', 'part_postcode', 'town', 'county_council']
  }
}
module.exports = config
