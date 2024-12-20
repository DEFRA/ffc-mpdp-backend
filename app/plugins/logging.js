const config = require('../config')

module.exports = {
  plugin: require('hapi-pino'),
  options: {
    logPayload: !config.get('isProd')
  }
}
