const convict = require('convict')
const convictFormatWithValidator = require('convict-format-with-validator')

convict.addFormats(convictFormatWithValidator)

const config = convict({
  host: {
    doc: 'The host to bind the Hapi server to',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'HOST'
  },
  port: {
    doc: 'The port to bind the Hapi server to',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  }
})

config.validate({ allowed: 'strict' })

module.exports = config
