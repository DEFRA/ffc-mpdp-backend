const { getPaymentSummary, getPaymentSummaryCsv } = require('../data/summary')

module.exports = [{
  method: 'GET',
  path: '/v1/payments/summary',
  handler: async (_request, h) => {
    const payments = await getPaymentSummary()
    return h.response(payments)
  }
}, {
  method: 'GET',
  path: '/v1/payments/summary/file',
  handler: async (_request, h) => {
    const paymentsCsv = await getPaymentSummaryCsv()
    return h.response(paymentsCsv)
      .type('text/csv')
      .header('Connection', 'keep-alive')
      .header('Cache-Control', 'no-cache')
      .header('Content-Disposition', 'attachment;filename=ffc-payments-by-year.csv')
  }
}]
