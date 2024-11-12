const Joi = require('joi')
const { getSearchSuggestions } = require('../services/fuzzy-search')

module.exports = {
  method: 'GET',
  path: '/v1/payments/search',
  options: {
    validate: {
      query: Joi.object({
        searchString: Joi.string().trim().min(1).required()
      }),
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },
    handler: async (request, h) => {
      let searchString = request.query.searchString
      try {
        searchString = decodeURIComponent(request.query.searchString)
      } catch (err) {
        console.log(`Error decoding ${searchString}`, err)
      }

      try {
        const records = await getSearchSuggestions(searchString)
        return h.response(records).code(!records.rows.length ? 404 : 200)
      } catch (error) {
        return h.response('Error while reading data: ' + error).code(500)
      }
    }
  }
}
