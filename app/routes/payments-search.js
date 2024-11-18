const Joi = require('joi')
const { getSearchSuggestions } = require('../data/search')

module.exports = {
  method: 'GET',
  path: '/v1/payments/search',
  options: {
    validate: {
      query: {
        searchString: Joi.string().trim().min(1).required()
      },
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },
    handler: async (request, h) => {
      const suggestions = await getSearchSuggestions(request.query.searchString)
      return h.response(suggestions).code(!suggestions.rows.length ? 404 : 200)
    }
  }
}
