const { getPaymentDetails } = require('../services/databaseService')

module.exports = {
  method: 'GET',
  path: '/paymentdetails',
  handler: async (request, h) => {
    try {
      const { payeeName, partPostcode } = request.query
      const records = await getPaymentDetails(payeeName, partPostcode)
      if (!records) return h.response('No data found').code(404)

      const payemntDetails = {
        payee_name: records[0].payee_name,
        payee_name2: records[0].payee_name,
        part_postcode: records[0].part_postcode,
        town: records[0].town,
        county_council: records[0].county_council,
        financial_year: records[0].financial_year,
        parliamentary_constituency: records[0].parliamentary_constituency,
        schemes: records.map(r1 => {
          return {
            scheme: r1.scheme,
            scheme_detail: r1.scheme_detail,
            activity_level: r1.activity_level,
            amount: r1.amount
          }
        })
      }

      return h.response(payemntDetails).code(200)
    } catch (error) {
      return h.response('Error while reading data' + error).code(500)
    }
  }
}
