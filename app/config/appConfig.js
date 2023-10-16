const databaseConfig = require('./databaseConfig')
const { environments } = require('./constants')

const config = {
  database: databaseConfig,
  isDev: process.env.NODE_ENV === environments.development,
  isProd: process.env.NODE_ENV === environments.production,
  env: process.env.NODE_ENV || environments.development,
  search: {
    fieldsToExtract: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year'],
    fieldsToSearch: ['payee_name', 'part_postcode', 'town', 'county_council'],
    suggestionResultsLimit: 6
  },
  csvFields: [
    'financial_year',
    'payee_name',
    'part_postcode',
    'town',
    'county_council',
    'parliamentary_constituency',
    'scheme',
    'scheme_detail',
    'amount'
  ]

}

module.exports = config
