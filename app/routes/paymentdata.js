const getPaymentData = require('../services/databaseService')

module.exports = {
  method: 'GET',
  path: '/paymentdata',
  handler: async (request, h) => {
    const records = await getPaymentData()
    return records
  }
}
