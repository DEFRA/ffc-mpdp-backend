const { Parser } = require('json2csv')
const { getSchemePaymentsByYear } = require('../data/database')

module.exports = [{
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
}, {
  method: 'GET',
  path: '/v1/payments/summary/file',
  handler: async (_request, h) => {
    const fields = [
      'financial year',
      'scheme',
      'amount'
    ]
    try {
      const csvParser = new Parser({ fields })
      const schemePaymentsByYear = (await getSchemePaymentsByYear()).sort((r1, r2) => r1.financial_year > r2.financial_year ? 1 : -1)
      // eslint-disable-next-line camelcase
      const schemePayments = schemePaymentsByYear.map(({ total_amount, financial_year, ...rest }) => ({
        'financial year': financial_year,
        amount: total_amount,
        ...rest
      }))
      const csv = csvParser.parse(schemePayments)

      return h.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-payments-by-year.csv')
    } catch (error) {
      return h.response('Error while reading data: ' + error).code(500)
    }
  }
}]
