const Joi = require('joi')
const { getPaymentData } = require('../services/fuzzy-search')

module.exports = {
  method: 'POST',
  path: '/v1/payments',
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
          amounts: Joi.array().items(Joi.string()),
          years: Joi.array().items(Joi.string())
        }).default({}),
        action: Joi.string().trim().optional('')
      }),
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },
    handler: async (request, h) => {
      try {
        const records = await getPaymentData(request.payload)
        return h.response(records).code(200)
      } catch (error) {
        return h.response('Error while reading data: ' + error).code(500)
      }
    }
  }
}
