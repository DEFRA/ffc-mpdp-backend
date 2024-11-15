const Joi = require('joi')
const { getPaymentData } = require('../services/fuzzy-search')
const { Parser } = require('json2csv')
const { getAllPaymentData } = require('../data/database')

module.exports = [{
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
},
/*
Not current in use in front end due to workaround.  Needs updating to stream responses to client
*/
{
  method: 'GET',
  path: '/v1/payments/file',
  handler: async (_request, h) => {
  // convert json to csv content
    const fields = [
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
    try {
      const paymentData = await getAllPaymentData()
      const csvParser = new Parser({ fields })
      const csv = csvParser.parse(paymentData)
      return h.response(csv)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-payment-data.csv')
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}]
