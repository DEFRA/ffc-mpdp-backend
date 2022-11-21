const { Sequelize, DataTypes, Op, where, fn, col } = require('sequelize')
const value = require('../config/appConfig')
const dbConfigAllEnv = require('../config/databaseConfig')
const dbConfig = dbConfigAllEnv[value.env]

const sequelize = new Sequelize(
  dbConfig
)
// Define the Model
const PaymentDataModel = sequelize.define('payment_activity_data', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  payee_name: DataTypes.STRING(32),
  part_postcode: DataTypes.STRING(8),
  town: DataTypes.STRING(32),
  parliamentary_constituency: DataTypes.STRING(32),
  county_council: DataTypes.STRING(64),
  scheme: DataTypes.STRING(64),
  scheme_detail: DataTypes.STRING(128),
  activity_level: DataTypes.STRING(16),
  amount: DataTypes.DOUBLE
})

// Collect and display the db restuls
async function getPaymentData (searchString = '', limit = 20, offset = 1) {
  if (searchString === '') throw new Error('Empty search content')
  console.log('searchString :' + searchString)
  const mf = 0.4 // Matching factor
  try {
    return PaymentDataModel.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        [Op.or]: [
          where(fn('SIMILARITY', col('payee_name'), searchString), { [Op.gt]: mf }),
          where(fn('SIMILARITY', col('part_postcode'), searchString), { [Op.gt]: mf }),
          where(fn('SIMILARITY', col('town'), searchString), { [Op.gt]: mf }),
          where(fn('SIMILARITY', col('parliamentary_constituency'), searchString), { [Op.gt]: mf }),
          where(fn('SIMILARITY', col('county_council'), searchString), { [Op.gt]: mf }),
          where(fn('SIMILARITY', col('scheme'), searchString), { [Op.gt]: mf }),
          where(fn('SIMILARITY', col('scheme_detail'), searchString), { [Op.gt]: mf }),
          where(fn('SIMILARITY', col('activity_level'), searchString), { [Op.gt]: mf })
        ]
      }
    })
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
    throw error
  }
}

module.exports = { getPaymentData }
