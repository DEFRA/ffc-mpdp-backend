const { Parser } = require('json2csv')
const { getAllPaymentData } = require('../services/databaseService')

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (request, res) => {
    // convert json to csv content
    const fields = ['payee_name', 'part_postcode', 'town', 'county_council', 'total_amount']
    const opts = { fields }
    try {
      const paymentData = await getAllPaymentData()
      const csvParser = new Parser({ fields })
      const csv = csvParser.parse(paymentData)
      return res.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=myfilename.csv')
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
