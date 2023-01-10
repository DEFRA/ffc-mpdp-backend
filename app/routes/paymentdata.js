const { getPaymentData } = require('../services/fuzzySearchService')

module.exports = {
  method: 'GET',
  path: '/paymentdata',
  handler: async (request, h) => {
    try {
      const { searchString, limit, offset, searchBy } = request.query
      const records = await getPaymentData(searchString, limit, offset, searchBy)
      if (records.length < 1) return h.response('No data found').code(404)
      return h.response(records).code(200)
    } catch (error) {
      return h.response('Error while reading data' + error).code(500)
    }
  }
}
