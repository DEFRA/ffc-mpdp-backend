const { Parser } = require('json2csv')
const { getCsvPaymentDataOfPayee } = require('../data/database')
const Joi = require('joi')

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

module.exports = {
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
}
