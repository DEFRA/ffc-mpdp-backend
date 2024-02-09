const { Sequelize, DataTypes, where, fn, col, and } = require('sequelize')
const config = require('../config/appConfig')
const dbConfigAllEnv = require('../config/databaseConfig')
const dbConfig = dbConfigAllEnv[config.env]
const cache = require('../cache')

const sequelize = new Sequelize(
  dbConfig
)
// Define the Model
const PaymentDataModel = sequelize.define('payment_activity_data', {
  payee_name: DataTypes.STRING(32),
  part_postcode: DataTypes.STRING(8),
  town: DataTypes.STRING(32),
  county_council: DataTypes.STRING(64),
  amount: DataTypes.DOUBLE
})

const getAllPaymentData = async () => {
  let cachedData = await cache.get(config.cacheConfig.segments.paymentData.name, 'allPaymentData')

  if (!cachedData || !Object.keys(cachedData).length) {
    cachedData = await getAllPaymentDataFromDB()
    await cache.set(config.cacheConfig.segments.paymentData.name, 'allPaymentData', cachedData)
  }

  return cachedData
}

// Collect all DB results
const getAllPaymentDataFromDB = async () => {
  try {
    const result = await PaymentDataModel.findAll({
      group: config.search.results.fieldsToExtract,
      attributes: [
        ...config.search.results.fieldsToExtract,
        [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
      ],
      raw: true
    })
    return result
  } catch (error) {
    console.log('Error occured while reading data : ' + error)
    throw error
  }
}

// payment details API
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

async function getPaymentDetails (payeeName = '', partPostcode = '') {
  if (payeeName === '' || partPostcode === '') throw new Error('Empty payeeName or  partPostcode')
  try {
    return PaymentDetailModel.findAll({
      group: config.search.details.fieldsToExtract,
      attributes: [
        ...config.search.details.fieldsToExtract,
        [sequelize.fn('sum', sequelize.col('amount')), 'amount']
      ],
      where: and(
        where(fn('btrim', col('payee_name')), payeeName),
        where(fn('btrim', col('part_postcode')), partPostcode)
      )
    })
  } catch (error) {
    console.log('Error occured while reading data : ' + error)
    throw error
  }
}

const getRawData = async () => {
  console.log('Getting Cached data')
  let cachedData = await cache.get(config.cacheConfig.segments.rawData.name, 'rawData')
  if (!cachedData || !Object.keys(cachedData).length) {
    console.log('No cached data found, getting raw data from DB')
    cachedData = await getRawDataFromDB()
    console.log(`Raw Data from db aquired, length: ${cachedData?.length}`)
    // await cache.set(config.cacheConfig.segments.rawData.name, 'rawData', cachedData)
    console.log('Returning raw data')
  }
  return cachedData
}

const getRawDataFromDB = async () => {
  try {
    console.log('Calling PaymentDEtailsModel')
    return PaymentDetailModel.findAll()
  } catch (error) {
    console.log('Error occured while reading data : ' + error)
    return []
  }
}

const getCsvPaymentDataOfPayee = async (payeeName, partPostcode) => {
  console.log('Getting Raw Data')
  const csvData = await getRawData()
  console.log('Raw Data acquired')
  return csvData.filter((item) =>
    item.payee_name?.toLowerCase() === payeeName?.toLowerCase() &&
    item.part_postcode?.toLowerCase() === partPostcode?.toLowerCase())
}

const schemePaymentsModel = sequelize.define('aggregate_scheme_payments', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  financial_year: DataTypes.STRING(8),
  scheme: DataTypes.STRING(64),
  total_amount: DataTypes.DOUBLE
})

const getSchemePaymentsByYear = async () => {
  try {
    const result = await schemePaymentsModel.findAll({
      attributes: [
        'scheme',
        'financial_year',
        'total_amount'
      ],
      raw: true
    })
    return result
  } catch (error) {
    console.log('Error occured while reading data : ' + error)
    throw error
  }
}

module.exports = {
  getAllPaymentData,
  PaymentDataModel,
  getPaymentDetails,
  PaymentDetailModel,
  getRawData,
  getCsvPaymentDataOfPayee,
  schemePaymentsModel,
  getSchemePaymentsByYear
}
