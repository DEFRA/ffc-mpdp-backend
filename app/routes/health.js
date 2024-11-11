module.exports = [{
  method: 'GET',
  path: '/healthy',
  handler
}, {
  method: 'GET',
  path: '/healthz',
  handler
}]

function handler (_request, h) {
  return h.response('ok').code(200)
}
