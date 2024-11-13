const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity')
const { Sequelize, DataTypes, where, fn, col, and } = require('sequelize')
const cache = require('../cache')
const config = require('../config')
const dbConfig = config.get('db')
const { search } = require('../search')

dbConfig.hooks.beforeConnect = async (cfg) => {
  if (config.get('isProd')) {
    const credential = new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID })
    const tokenProvider = getBearerTokenProvider(credential, 'https://ossrdbms-aad.database.windows.net/.default')
    cfg.password = tokenProvider
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

async function getAllPaymentData () {
  let cachedData = await cache.get('allPaymentData')

  if (!cachedData || !Object.keys(cachedData).length) {
    cachedData = await getAllPaymentDataFromDB()
    await cache.set('allPaymentData', cachedData)
  }

  return cachedData
}

async function getAllPaymentDataFromDB () {
  try {
    const result = await PaymentDataModel.findAll({
      group: search.results.fieldsToExtract,
      attributes: [
        ...search.results.fieldsToExtract,
        [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
      ],
      raw: true
    })
    return result
  } catch (error) {
    console.error('Error occurred while reading data:', error)
    throw error
  }
}

async function getPaymentDetails (payeeName = '', partPostcode = '') {
  if (payeeName === '' || partPostcode === '') {
    throw new Error('Empty payeeName or  partPostcode')
  }
  try {
    return PaymentDetailModel.findAll({
      group: search.details.fieldsToExtract,
      attributes: [
        ...search.details.fieldsToExtract,
        [sequelize.fn('sum', sequelize.col('amount')), 'amount']
      ],
      where: and(
        where(fn('btrim', col('payee_name')), payeeName),
        where(fn('btrim', col('part_postcode')), partPostcode)
      )
    })
  } catch (error) {
    console.error('Error occurred while reading data:', error)
    throw error
  }
}

async function getRawData () {
  let cachedData = await cache.get('rawData')
  if (!cachedData || !Object.keys(cachedData).length) {
    cachedData = await getRawDataFromDB()
    await cache.set('rawData', cachedData)
  }
  return cachedData
}

async function getRawDataFromDB () {
  try {
    return await PaymentDetailModel.findAll()
  } catch (error) {
    console.error('Error occurred while reading data:', error)
    throw error
  }
}

async function getCsvPaymentDataOfPayee (payeeName, partPostcode) {
  const csvData = await getRawData()
  return csvData.filter((item) =>
    item.payee_name?.toLowerCase() === payeeName?.toLowerCase() &&
    item.part_postcode?.toLowerCase() === partPostcode?.toLowerCase())
}

async function getSchemePaymentsByYear () {
  try {
    const result = await SchemePaymentsModel.findAll({
      attributes: [
        'scheme',
        'financial_year',
        'total_amount'
      ],
      raw: true
    })
    return result
  } catch (error) {
    console.error('Error occurred while reading data:', error)
    throw error
  }
}

module.exports = {
  SchemePaymentsModel,
  PaymentDataModel,
  PaymentDetailModel,
  getAllPaymentData,
  getPaymentDetails,
  getRawData,
  getCsvPaymentDataOfPayee,
  getSchemePaymentsByYear
}
