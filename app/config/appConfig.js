const databaseConfig = require('./databaseConfig')
const { environments } = require('./constants')

const config = {
  database: databaseConfig,
  isDev: process.env.NODE_ENV === environments.development,
  isProd: process.env.NODE_ENV === environments.production,
  env: process.env.NODE_ENV || environments.development,
  search: {
    fieldsToExtract: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme'],
    fieldsToSearch: ['payee_name', 'part_postcode', 'town', 'county_council']
  },
  searchSuggestionResultsLimit: 6
}

module.exports = config
