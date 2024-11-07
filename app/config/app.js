const databaseConfig = require('./database')
const { environments, isDev, isTest, isProd } = require('./constants')
const cacheConfig = require('./cache')
const allPaymentDataFields = [
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

const config = {
  database: databaseConfig,
  isDev,
  isProd,
  env: process.env.NODE_ENV || environments.development,
  search: {
    results: {
      fieldsToExtract: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year'],
      fieldsToSearch: ['payee_name', 'part_postcode', 'town', 'county_council'],
      suggestionResultsLimit: 6
    },
    details: {
      fieldsToExtract: allPaymentDataFields.slice(0, -1) // Remove amount
    }
  },
  csvFields: allPaymentDataFields,
  useRedis: !isTest && cacheConfig.redisCatboxOptions.host !== undefined,
  cacheConfig
}

module.exports = config
