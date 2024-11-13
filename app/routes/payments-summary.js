const { getSchemePaymentsByYear } = require('../services/database')

module.exports = {
  method: 'GET',
  path: '/v1/payments/summary',
  handler: async (_request, h) => {
    try {
      const schemePayments = (await getSchemePaymentsByYear()).reduce((acc, item) => {
        if (!acc[item.financial_year]) {
          acc[item.financial_year] = []
        }
        acc[item.financial_year].push(item)
        return acc
      }, {})
      return h.response(schemePayments).code(200)
    } catch (error) {
      return h.response('Error while reading data: ' + error).code(500)
    }
  }
}