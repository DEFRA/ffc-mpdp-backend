// const { getPaymentData } = require('../services/databaseService')
const { getPaymentData } = require('../services/fuzzySearchService')

module.exports = {
  method: 'GET',
  path: '/paymentdata',
  handler: async (request, h) => {
    try {
      console.log("/paymentdata route")
      const { searchString, limit, offset } = request.query
      console.log("/paymentdata route2")
      const records = await getPaymentData(searchString, limit, offset)
      console.log("/paymentdata route3")
      if (!records) return h.response('No data found').code(404)
      return h.response(records).code(200)
    } catch (error) {
      return h.response('Error while reading data' + error).code(500)
    }
  }
}
