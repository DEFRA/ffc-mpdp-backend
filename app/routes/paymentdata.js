const { getPaymentData } = require('../services/databaseService')

module.exports = {
  method: 'GET',
  path: '/paymentdata',
  handler: async (request, h) => {
    try {
      const records = await getPaymentData()
      if (!records) return h.response('No data found').code(404)
      return h.response(records).code(200)
    } catch (error) {
      
      return h.response('Error while reading data' + error + ' env: '+ process.env).code(500)
    }
  }
}
