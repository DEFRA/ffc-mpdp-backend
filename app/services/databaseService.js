const { Sequelize, DataTypes, where, fn, col, and } = require('sequelize')
const config = require('../config/appConfig')
const dbConfigAllEnv = require('../config/databaseConfig')
const dbConfig = dbConfigAllEnv[config.env]

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

// Locally cached data
let cachedPaymentData = null
async function getAllPaymentData () {
  if (!cachedPaymentData) {
    cachedPaymentData = await getAllPaymentDataFromDB()
  }
  return cachedPaymentData
}

// Collect all DB results
async function getAllPaymentDataFromDB () {
  try {
    const result = await PaymentDataModel.findAll({
      group: config.search.fieldsToExtract,
      attributes: [
        ...config.search.fieldsToExtract,
        [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
      ],
      raw: true
    })
    return result
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
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
      where: and(
        where(fn('btrim', col('payee_name')), payeeName),
        where(fn('btrim', col('part_postcode')), partPostcode)
      )
    })
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
    throw error
  }
}

// Cached CSV data
let cachedCsvData = null
async function getCsvPaymentData () {
  if (!cachedCsvData) {
    cachedCsvData = await getCsvPaymentDataFromDb()
  }
  return cachedCsvData
}

async function getCsvPaymentDataFromDb () {
  try {
    return PaymentDetailModel.findAll()
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
    throw error
  }
}

async function getCsvPaymentDataOfPayee (payeeName, partPostcode) {
  const csvData = await getCsvPaymentData()
  return csvData.filter((item) => item.payee_name === payeeName && item.part_postcode === partPostcode)
}

const schemePaymentsModel = sequelize.define('payment_activity_data', {
  financial_year: DataTypes.STRING(8),
  scheme: DataTypes.STRING(64),
  amount: DataTypes.DOUBLE
})

const getSchemePaymentsByYear = async () => {
  try {
    const result = await schemePaymentsModel.findAll({
      group: ['scheme', 'financial_year'],
      attributes: [
        'scheme',
        'financial_year',
        [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
      ],
      raw: true
    })
    return result
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
    throw error
  }
}

module.exports = {
  getAllPaymentData,
  PaymentDataModel,
  getPaymentDetails,
  PaymentDetailModel,
  getCsvPaymentData,
  getCsvPaymentDataOfPayee,
  schemePaymentsModel,
  getSchemePaymentsByYear
}
