const getPaymentData = require('../services/database-service')

module.exports = {
  method: 'GET',
  path: '/paymentdata',
  handler: (request, h) => {
    const records = getPaymentData()
    return records
  }
}
