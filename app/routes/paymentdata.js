const { getPaymentData } = require('../services/fuzzySearchService')

module.exports = {
  method: 'GET',
  path: '/paymentdata',
  handler: async (request, h) => {
    try {
      const { searchString, limit, offset, sortBy } = request.query
      const records = await getPaymentData(searchString, limit, offset, sortBy)
      if (records.rows.length < 1) return h.response('No data found').code(404)
      return h.response(records).code(200)
    } catch (error) {
      return h.response('Error while reading data' + error).code(500)
    }
  }
}
