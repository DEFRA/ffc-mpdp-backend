const databaseConfig = require('./databaseConfig')
const { environments, isDev, isTest, isProd } = require('./constants')
const cacheConfig = require('./cache')

const config = {
  database: databaseConfig,
  isDev,
  isProd,
  env: process.env.NODE_ENV || environments.development,
  search: {
    fieldsToExtract: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme'],
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
  ],
  useRedis: !isTest && cacheConfig.redisCatboxOptions.host !== undefined,
  cacheConfig,
}

module.exports = config
