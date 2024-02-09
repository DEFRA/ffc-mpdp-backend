const { Parser } = require('json2csv')
const { getCsvPaymentDataOfPayee } = require('../services/databaseService')
const Joi = require('joi')
const config = require('../config/appConfig')

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
  handler: async (request, res) => {
    const { payeeName, partPostcode } = request.query
    try {
      console.log(`Downloading details for ${payeeName}`)
      const paymentData = await getCsvPaymentDataOfPayee(payeeName, partPostcode)
      console.log(`Payment data acquired`)
      const csvParser = new Parser({ fields: config.csvFields })
      console.log(`Parser created`)
      const csv = csvParser.parse(paymentData)
      console.log('csv created, sending response back.')
      return res.response(csv)
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
