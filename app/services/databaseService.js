const { Sequelize, DataTypes, Op, where, fn, col } = require('sequelize')
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

// Collect the DB restuls
async function getPaymentData (searchString = '', limit = 20, offset = 0) {
  if (searchString === '') throw new Error('Empty search content')
  const mf = 0.4 // Matching factor
  const whereClause = {
    [Op.or]: [
      where(fn('SIMILARITY', col('payee_name'), searchString), { [Op.gt]: mf }),
      where(fn('SIMILARITY', col('part_postcode'), searchString), { [Op.gt]: mf }),
      where(fn('SIMILARITY', col('town'), searchString), { [Op.gt]: mf }),
      where(fn('SIMILARITY', col('county_council'), searchString), { [Op.gt]: mf })
    ]
  }

  try {
    const result = await PaymentDataModel.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereClause,
      group: ['payee_name', 'part_postcode', 'town', 'county_council'],
      attributes: [
        'payee_name', 'part_postcode', 'town', 'county_council',
        [sequelize.fn('sum', sequelize.col('amount')), 'total_amount']
      ]
    })
    return { count: result.count.length, rows: result.rows }
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
    throw error
  }
}

// payment details API
const PaymentDetailModel = sequelize.define('payment_activity_data', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  payee_name: DataTypes.STRING(32),
  part_postcode: DataTypes.STRING(8),
  town: DataTypes.STRING(32),
  county_council: DataTypes.STRING(64),
  financial_year: DataTypes.STRING(8),
  parliamentary_constituency: DataTypes.STRING(32),
  scheme: DataTypes.STRING(64),
  scheme_detail: DataTypes.STRING(128),
  activity_level: DataTypes.STRING(16),
  amount: DataTypes.DOUBLE
})

async function getPaymentDetails (payeeName = '', partPostcode = '') {
  if (payeeName === '' || partPostcode === '') throw new Error('Empty payeeName or  partPostcode')
  try {
    return PaymentDetailModel.findAll({
      where: {
        payee_name: payeeName,
        part_postcode: partPostcode
      }
    })
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
    throw error
  }
}

module.exports = { getPaymentData, PaymentDataModel, getPaymentDetails, PaymentDetailModel }
