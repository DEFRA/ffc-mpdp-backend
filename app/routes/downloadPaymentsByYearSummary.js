const { Parser } = require('json2csv')
const { getSchemePaymentsByYear } = require('../services/databaseService')

module.exports = {
  method: 'GET',
  path: '/downloadPaymentsByYearSummary',
  handler: async (_request, _response) => {
    const fields = [
      'financial_year',
      'scheme',
      'amount'
    ]
    try {
      const schemePaymentsArray = []
      const csvParser = new Parser({ fields })
      const schemePayments = (await getSchemePaymentsByYear()).reduce((acc, item) => {
        (acc[item.financial_year] = acc[item.financial_year] || []).push(item)
        return acc
      }, {})

      for (const property in schemePayments) {
        for (const item of schemePayments[property]) {
          item.amount = item.total_amount
          delete item.total_amount
          schemePaymentsArray.push(item)
        }
      }

      const csv = csvParser.parse(schemePaymentsArray)

      return _response.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-year-payments-summary.csv')
    } catch (error) {
      return _response.response('Error while reading data' + error).code(500)
    }
  }
}
