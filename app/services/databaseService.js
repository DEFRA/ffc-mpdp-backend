const { Sequelize, DataTypes } = require('sequelize')
const value = require('../config/appConfig')
const dbConfigAllEnv = require('../config/databaseConfig')
const dbConfig = dbConfigAllEnv[value.env]

const sequelize = new Sequelize(
  dbConfig
)
// host: host.docker.internal // for docker image
// Define the Model
const PaymentDataModel = sequelize.define('payment_activity_data', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  payee_name: DataTypes.CHAR,
  part_postcode: DataTypes.CHAR,
  town: DataTypes.CHAR,
  parliamentary_constituency: DataTypes.CHAR,
  county_council: DataTypes.CHAR,
  scheme: DataTypes.CHAR,
  scheme_detail: DataTypes.CHAR,
  activity_level: DataTypes.CHAR,
  amount: DataTypes.DOUBLE
})

// Collect and display the db restuls
async function getPaymentData () {
  try {
    return PaymentDataModel.findAll()
  } catch (error) {
    console.error('Error occured while reading data : ' + error)
    throw error
  }
}

module.exports = { getPaymentData }
