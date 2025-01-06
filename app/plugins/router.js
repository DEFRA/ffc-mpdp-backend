module.exports = {
  plugin: {
    name: 'router',
    register: async function (server) {
      server.route([].concat(
        require('../routes/health'),
        require('../routes/payments'),
        require('../routes/payments-payee'),
        require('../routes/payments-search'),
        require('../routes/payments-summary')
      ))
    }
  }
}
