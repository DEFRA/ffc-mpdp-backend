const getPaymentData = require('../services/database-service')

module.exports = {
  method: 'GET',
  path: '/paymentdata',
  handler: async (request, h) => {
    const records = await getPaymentData()
    return records
  }
}
