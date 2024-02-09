const { Parser } = require('json2csv')
const { getRawData } = require('../services/databaseService')

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request, res) => {
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
      console.log(`Get all raw data`)
      const paymentData = await getRawData()
      console.log('Raw data acquired')
      const csvParser = new Parser({ fields })
      console.log('Parser created')
      const csv = csvParser.parse(paymentData)
      console.log('csv created, sending back response.')
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
