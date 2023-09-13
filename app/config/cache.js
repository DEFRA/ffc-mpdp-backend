const { environments } = require('./constants')

const isProd = process.env.NODE_ENV === environments.production;
const defaultExpiresIn = (isProd? 3600 : 300) * 1000

module.exports = {
    paymentDataSegment: {
      name: 'paymentData',
      expiresIn: defaultExpiresIn
    },
    redisCatboxOptions: {
      host: process.env.REDIS_HOSTNAME,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      partition: process.env.REDIS_PARTITION ?? 'ffc-mpdp-backend',
      tls: isProd ? {} : undefined
    }
  }