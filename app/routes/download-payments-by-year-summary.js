const { Parser } = require('json2csv')
const { getSchemePaymentsByYear } = require('../services/database')

module.exports = {
  method: 'GET',
  path: '/downloadPaymentsByYearSummary',
  handler: async (_request, _response) => {
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
