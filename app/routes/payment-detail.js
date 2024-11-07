const { getPaymentDetails } = require('../services/database')

module.exports = {
  method: 'GET',
  path: '/paymentdetails',
  handler: async (request, h) => {
    try {
      const { payeeName, partPostcode } = request.query
      const records = await getPaymentDetails(payeeName, partPostcode)
      if (!records || records.length < 1) {
        return h.response('No data found').code(404)
      }

      const paymentDetails = {
        payee_name: records[0].payee_name,
        payee_name2: records[0].payee_name,
        part_postcode: records[0].part_postcode,
        town: records[0].town,
        county_council: records[0].county_council,
        parliamentary_constituency: records[0].parliamentary_constituency,
        schemes: records.map(r1 => {
          return {
            name: r1.scheme,
            detail: r1.scheme_detail,
            activity_level: r1.activity_level,
            amount: r1.amount,
            financial_year: r1.financial_year
          }
        })
      }

      return h.response(paymentDetails).code(200)
    } catch (error) {
      return h.response('Error while reading data' + error).code(500)
    }
  }
}
