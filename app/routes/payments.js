const Joi = require('joi')
const { getPaymentData } = require('../data/search')
const { getAllPaymentsCsv } = require('../data/payments')

module.exports = [{
  method: 'POST',
  path: '/v1/payments',
  options: {
    validate: {
      payload: {
        searchString: Joi.string().trim().min(1).required(),
        limit: Joi.number().required(),
        offset: Joi.number().default(0),
        sortBy: Joi.string().default('score'),
        filterBy: Joi.object({
          schemes: Joi.array().items(Joi.string()),
          counties: Joi.array().items(Joi.string()),
          amounts: Joi.array().items(Joi.string()),
          years: Joi.array().items(Joi.string())
        }).default({}),
        action: Joi.string().trim().optional('')
      },
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },
    handler: async (request, h) => {
      const payments = await getPaymentData(request.payload)
      return h.response(payments).code(200)
    }
  }
},
/*
Not current in use in front end due to workaround.  Needs updating to stream responses to client
*/
{
  method: 'GET',
  path: '/v1/payments/file',
  handler: async (_request, h) => {
    const payments = await getAllPaymentsCsv()
    return h.response(payments)
      .type('text/csv')
      .header('Connection', 'keep-alive')
      .header('Cache-Control', 'no-cache')
      .header('Content-Disposition', 'attachment;filename=ffc-payment-data.csv')
  }
}]
