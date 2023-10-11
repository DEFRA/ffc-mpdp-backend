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
      const csvParser = new Parser({ fields })
      const schemePaymentsByYear = (await getSchemePaymentsByYear()).sort((r1, r2) => r1.financial_year > r2.financial_year ? 1 : -1)
      const schemePayments = schemePaymentsByYear.map(({ total_amount, ...rest }) => ({
        amount: total_amount,
        ...rest
      }))
      const csv = csvParser.parse(schemePayments)

      return _response.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-payments-by-year.csv')
    } catch (error) {
      return _response.response('Error while reading data' + error).code(500)
    }
  }
}
