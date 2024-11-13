const convict = require('convict')

const config = convict({
  segment: {
    doc: 'The cache segment name',
    format: String,
    default: 'payments'
  },
  expiresIn: {
    doc: 'The cache expiration time in milliseconds',
    format: 'int',
    default: 15 * 60 * 1000
  },
  useRedis: {
    doc: 'Use Redis for the cache instead of in memory cache',
    format: Boolean,
    default: process.env.NODE_ENV !== 'test'
  },
  catbox: {
    host: {
      doc: 'The cache host',
      format: String,
      default: null,
      env: 'REDIS_HOSTNAME'
    },
    port: {
      doc: 'The cache port',
      format: 'port',
      default: 6379,
      env: 'REDIS_PORT'
    },
    password: {
      doc: 'The cache password',
      format: String,
      default: process.env.NODE_ENV === 'production' ? null : undefined,
      env: 'REDIS_PASSWORD'
    },
    partition: {
      doc: 'The cache partition',
      format: String,
      default: 'ffc-mpdp-backend',
      env: 'REDIS_PARTITION'
    },
    tls: {
      doc: 'Enable TLS for the cache connection',
      format: '*',
      default: process.env.NODE_ENV === 'production' ? {} : undefined
    }
  }
})

config.validate({ allowed: 'strict' })

module.exports = config
