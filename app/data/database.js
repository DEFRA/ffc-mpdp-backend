const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity')
const { Sequelize, DataTypes, where, fn, col, and } = require('sequelize')
const { get, set } = require('../cache')
const config = require('../config')
const dbConfig = config.get('db')

if (config.get('isProd')) {
  dbConfig.hooks = {
    beforeConnect: async (cfg) => {
      const credential = new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID })
      const getAccessToken = getBearerTokenProvider(credential, 'https://ossrdbms-aad.database.windows.net/.default')
      const token = await getAccessToken()
      cfg.password = token
    }
  }
}

const sequelize = new Sequelize(dbConfig)

const SchemePaymentsModel = sequelize.define('aggregate_scheme_payments', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  financial_year: DataTypes.STRING(8),
  scheme: DataTypes.STRING(64),
  total_amount: DataTypes.DOUBLE
})

const PaymentDataModel = sequelize.define('payment_activity_data', {
  payee_name: DataTypes.STRING(32),
  part_postcode: DataTypes.STRING(8),
  town: DataTypes.STRING(32),
  county_council: DataTypes.STRING(64),
  amount: DataTypes.DOUBLE
})

const PaymentDetailModel = sequelize.define('payment_activity_data', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  payee_name: DataTypes.STRING(128),
  part_postcode: DataTypes.STRING(8),
  town: DataTypes.STRING(128),
  county_council: DataTypes.STRING(64),
  financial_year: DataTypes.STRING(8),
  parliamentary_constituency: DataTypes.STRING(64),
  scheme: DataTypes.STRING(64),
  scheme_detail: DataTypes.STRING(128),
  amount: DataTypes.DOUBLE
})

async function healthCheck () {
  await sequelize.authenticate()
}

async function getAnnualPayments () {
  return SchemePaymentsModel.findAll({
    attributes: [
      'scheme',
      'financial_year',
      'total_amount'
    ],
    raw: true
  })
}

async function getPayeePayments (payeeName, partPostcode) {
  return PaymentDetailModel.findAll({
    group: [
      'financial_year',
      'payee_name',
      'part_postcode',
      'town',
      'county_council',
      'parliamentary_constituency',
      'scheme',
      'scheme_detail'
    ],
    attributes: [
      'financial_year',
      'payee_name',
      'part_postcode',
      'town',
      'county_council',
      'parliamentary_constituency',
      'scheme',
      'scheme_detail',
      [sequelize.fn('sum', sequelize.col('amount')), 'amount']
    ],
    where: and(
      where(fn('btrim', col('payee_name')), payeeName),
      where(fn('btrim', col('part_postcode')), partPostcode)
    )
  })
}

async function getAllPayments () {
  const cachedPayments = await get('payments')

  if (Array.isArray(cachedPayments) && cachedPayments.length > 0) {
    return cachedPayments
  }

  const payments = await PaymentDataModel.findAll({
    group: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year'],
    attributes: [
      'payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year',
      [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
    ],
    raw: true
  })

  if (Array.isArray(payments) && payments.length > 0) {
    await set('payments', payments)
  }

  return payments
}

async function getAllPaymentsByPage (page = 1, pageSize = 250) {
  return PaymentDataModel.findAll({
    group: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year', 'scheme_detail'],
    attributes: [
      'payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year', 'scheme_detail',
      [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
    ],
    raw: true,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order: [['payee_name', 'ASC']]
  })
}

module.exports = {
  SchemePaymentsModel,
  PaymentDataModel,
  PaymentDetailModel,
  getAnnualPayments,
  getPayeePayments,
  getAllPayments,
  getAllPaymentsByPage,
  healthCheck
}
