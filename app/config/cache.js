const { isProd } = require('./constants')
const defaultExpiresIn = 900 * 1000 // 15 Minutes

module.exports = {
  segments: {
    paymentData: {
      name: 'paymentData',
      expiresIn: defaultExpiresIn
    }
  },
  redisCatboxOptions: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION ?? 'ffc-mpdp-backend',
    tls: isProd ? {} : undefined
  }
}
