const { Parser } = require('json2csv')
const Joi = require('joi')
const { getPaymentDetails } = require('../data/database')
const { getCsvPaymentDataOfPayee } = require('../data/database')

const csvFields = [
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

module.exports = [{
  method: 'GET',
  path: '/v1/payments/{payeeName}/{partPostcode}',
  handler: async (request, h) => {
    try {
      const { payeeName, partPostcode } = Object.keys(request.query).length ? request.query : request.params
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
      return h.response('Error while reading data: ' + error).code(500)
    }
  }
}, {
  method: 'GET',
  path: '/v1/payments/{payeeName}/{partPostcode}/file',
  options: {
    validate: {
      params: Joi.object({
        payeeName: Joi.string().trim().required(),
        partPostcode: Joi.string().trim().required()
      }),
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    }
  },
  handler: async (request, h) => {
    const { payeeName, partPostcode } = Object.keys(request.query).length ? request.query : request.params
    try {
      const paymentData = await getCsvPaymentDataOfPayee(payeeName, partPostcode)
      const csvParser = new Parser({ fields: csvFields })
      const csv = csvParser.parse(paymentData)
      return h.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-payment-details.csv')
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}]
