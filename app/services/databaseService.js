const { Sequelize, DataTypes, where, fn, col, and } = require('sequelize')
const value = require('../config/appConfig')
const dbConfigAllEnv = require('../config/databaseConfig')
const dbConfig = dbConfigAllEnv[value.env]

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

// Collect all DB results
async function getAllPaymentData () {
  try {
    const result = await PaymentDataModel.findAll({
      group: ['payee_name', 'part_postcode', 'town', 'county_council'],
      attributes: [
        'payee_name', 'part_postcode', 'town', 'county_council',
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
  activity_level: DataTypes.STRING(64),
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

module.exports = { getAllPaymentData, PaymentDataModel, getPaymentDetails, PaymentDetailModel }
