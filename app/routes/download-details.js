const { Parser } = require('json2csv')
const { getCsvPaymentDataOfPayee } = require('../services/database')
const Joi = require('joi')
const config = require('../config/app')

module.exports = {
  method: 'GET',
  path: '/downloaddetails',
  options: {
    validate: {
      query: Joi.object({
        payeeName: Joi.string().trim().required(),
        partPostcode: Joi.string().trim().required()
      }),
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    }
  },
  handler: async (request, h) => {
    const { payeeName, partPostcode } = request.query
    try {
      const paymentData = await getCsvPaymentDataOfPayee(payeeName, partPostcode)
      const csvParser = new Parser({ fields: config.csvFields })
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
