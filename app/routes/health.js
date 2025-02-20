const { healthCheck } = require('../data/database')

module.exports = [{
  method: 'GET',
  path: '/healthy',
  handler: async function (_request, h) {
    await healthCheck()
    return h.response('ok')
  }
}, {
  method: 'GET',
  path: '/healthz',
  handler: function (_request, h) {
    return h.response('ok')
  }
}]
