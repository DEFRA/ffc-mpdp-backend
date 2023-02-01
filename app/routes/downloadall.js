const { Parser } = require('json2csv')
const { getCsvPaymentData } = require('../services/databaseService')

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (request, res) => {
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
      const paymentData = await getCsvPaymentData()
      const csvParser = new Parser({ fields })
      const csv = csvParser.parse(paymentData)
      return res.response(csv)
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
