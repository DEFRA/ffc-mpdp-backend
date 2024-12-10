const Joi = require('joi')
const { getPaymentData } = require('../data/search')
const { getAllPaymentsCsv, getPaymentsCsv } = require('../data/payments')

module.exports = [{
  method: 'POST',
  path: '/v1/payments',
  options: {
    validate: {
      payload: {
        searchString: Joi.string().trim().min(1).required(),
        limit: Joi.number().integer().positive().required(),
        offset: Joi.number().integer().positive().allow(0).default(0),
        sortBy: Joi.string().default('score'),
        filterBy: Joi.object({
          schemes: Joi.array().items(Joi.string().trim().lowercase()),
          counties: Joi.array().items(Joi.string().trim().lowercase()),
          amounts: Joi.array().items(Joi.string()),
          years: Joi.array().items(Joi.string())
        }).default({}),
        action: Joi.string().trim().optional()
      },
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },
    handler: async (request, h) => {
      const payments = await getPaymentData(request.payload)
      return h.response(payments)
    }
  }
},
{
  method: 'POST',
  path: '/v1/payments/file',
  options: {
    validate: {
      payload: {
        searchString: Joi.string().trim().min(1).required(),
        sortBy: Joi.string().default('score'),
        filterBy: Joi.object({
          schemes: Joi.array().items(Joi.string().lowercase()),
          counties: Joi.array().items(Joi.string().lowercase()),
          amounts: Joi.array().items(Joi.string()),
          years: Joi.array().items(Joi.string())
        }).default({})
      },
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },
    handler: async (request, h) => {
      const payments = await getPaymentsCsv(request.payload)
      return h.response(payments)
    }
  }
},
{
  method: 'GET',
  path: '/v1/payments/file',
  handler: async (_request, h) => {
    const paymentsStream = getAllPaymentsCsv()
    return h.response(paymentsStream)
  }
}]
