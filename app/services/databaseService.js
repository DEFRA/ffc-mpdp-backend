const { Sequelize, DataTypes } = require('sequelize')
const value = require('../config/appConfig')
const dbConfigAllEnv = require('../config/databaseConfig')
const dbConfig = dbConfigAllEnv[value.env]

const sequelize = new Sequelize(
  dbConfig.database, // 'postgres', // database
  dbConfig.username, // 'postgres', // username
  dbConfig.password, // 'postgres', // password
  {
    host: dbConfig.host, // 'localhost',
    dialect: dbConfig.dialect, // 'postgres',
    port: dbConfig.port, // port:5432,
    define: {
      timestamps: false
    }
  }
)
// host: host.docker.internal // for docker image
// Define the Model
const PaymentData = sequelize.define('payment_activity_data', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  payee_name: DataTypes.CHAR,
  part_postcode: DataTypes.CHAR,
  town: DataTypes.CHAR,
  parliamentary_constituency: DataTypes.CHAR,
  county_council: DataTypes.CHAR,
  scheme: DataTypes.CHAR,
  activity_detail: DataTypes.CHAR,
  amount: DataTypes.DOUBLE
})

// Collect and display the db restuls
async function getPaymentData () {
  try {
    return PaymentData.findAll()
  } catch (error) {
    console.log('Error occured while reading data : ' + error)
    // TODO handle this error
  }
}

module.exports = getPaymentData
