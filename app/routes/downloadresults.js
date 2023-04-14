const { Parser } = require('json2csv')
const { getPaymentData } = require('../services/databaseService')
const Joi = require('joi')
const config = require('../config/appConfig')

module.exports = {
  method: 'POST',
  path: '/downloadresults',
  options: {
    validate: {
      payload: Joi.object({
        searchString: Joi.string().trim().min(1).required(),
        limit: Joi.number().required(),
        offset: Joi.number().default(0),
        sortBy: Joi.string().optional().default('score'),
        filterBy: Joi.object({
          schemes: Joi.array().items(Joi.string()),
          counties: Joi.array().items(Joi.string()),
          amounts: Joi.array().items(Joi.string())
        }).default({})
      }),
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    }
  },
  handler: async (request, res) => {
    try {
      const paymentData = await getPaymentData(request.payload)
      const csvParser = new Parser({ fields: config.csvFields })
      const csv = csvParser.parse(paymentData)
      return res.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-payment-results.csv')
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
