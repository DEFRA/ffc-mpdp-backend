const Joi = require('joi')

const { getSearchSuggestions } = require('../services/fuzzySearchService')

module.exports = {
  method: 'GET',
  path: '/searchsuggestion',
  options: {
    validate: {
      query: Joi.object({
        searchString: Joi.string().trim().min(1).required()
      }),
      failAction: async (_request, h, error) => h.response(error.toString()).code(400).takeover()
    },

    handler: async (request, h) => {
      try {
        console.log("test build")
        const records = await getSearchSuggestions(request.query.searchString)
        return h.response(records).code(!records.rows.length ? 404 : 200)
        
      } catch (error) {
        return h.response('Error while reading data' + error).code(500)
      }
    }
  }

}
