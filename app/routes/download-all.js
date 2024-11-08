const { Parser } = require('json2csv')
const { getRawData } = require('../services/database')

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request, h) => {
    // convert json to csv content
    const fields = [
      'financial_year',
      'payee_name',
      'part_postcode',
      'town',
      'county_council',
      'parliamentary_constituency',
      'scheme',
      'scheme_detail',
      'amount'
    ]
    try {
      const paymentData = await getRawData()
      const csvParser = new Parser({ fields })
      const csv = csvParser.parse(paymentData)
      return h.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-payment-data.csv')
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
