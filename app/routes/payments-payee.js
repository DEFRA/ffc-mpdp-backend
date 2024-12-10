const Joi = require('joi')
const { getPayeeDetails, getPayeeDetailsCsv } = require('../data/payee')

const options = {
  validate: {
    params: {
      payeeName: Joi.string().trim().required(),
      partPostcode: Joi.string().trim().required()
    },
    failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
  }
}

module.exports = [{
  method: 'GET',
  path: '/v1/payments/{payeeName}/{partPostcode}',
  options,
  handler: async (request, h) => {
    const { payeeName, partPostcode } = request.params
    const payeeDetails = await getPayeeDetails(payeeName, partPostcode)

    if (!payeeDetails) {
      return h.response('Payee not found').code(404)
    }

    return h.response(payeeDetails)
  }
}, {
  method: 'GET',
  path: '/v1/payments/{payeeName}/{partPostcode}/file',
  options,
  handler: async (request, h) => {
    const { payeeName, partPostcode } = request.params
    const payeeDetailsCsv = await getPayeeDetailsCsv(payeeName, partPostcode)

    return h.response(payeeDetailsCsv)
      .type('text/csv')
      .header('Content-Disposition', 'attachment;filename=ffc-payment-details.csv')
  }
}]
