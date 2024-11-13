const convict = require('convict')
const convictFormatWithValidator = require('convict-format-with-validator')

convict.addFormats(convictFormatWithValidator)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  isDev: {
    doc: 'True if the application is in development mode.',
    format: Boolean,
    default: process.env.NODE_ENV === 'development'
  },
  isTest: {
    doc: 'True if the application is in test mode.',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  isProd: {
    doc: 'True if the application is in production mode.',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  server: {
    host: {
      doc: 'The host to bind.',
      format: 'ipaddress',
      default: '0.0.0.0',
      env: 'HOST'
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 3000,
      env: 'PORT',
      arg: 'port'
    }
  },
  db: {
    host: {
      doc: 'The database host.',
      format: String,
      default: null,
      env: 'POSTGRES_HOST'
    },
    port: {
      doc: 'The database port.',
      format: 'port',
      default: 5432,
      env: 'POSTGRES_PORT'
    },
    username: {
      doc: 'The database username.',
      format: String,
      default: null,
      env: 'POSTGRES_USERNAME'
    },
    password: {
      doc: 'The database password.',
      format: String,
      default: null,
      env: 'POSTGRES_PASSWORD'
    },
    schema: {
      doc: 'The database schema.',
      format: String,
      default: 'public',
      env: 'POSTGRES_SCHEMA_NAME'
    },
    database: {
      doc: 'The database name.',
      format: String,
      default: null,
      env: 'POSTGRES_DB'
    },
    logging: {
      doc: 'Enable database logging.',
      format: Boolean,
      default: false
    },
    dialect: {
      doc: 'The database dialect.',
      format: String,
      default: 'postgres'
    },
    dialectOptions: {
      ssl: {
        doc: 'Enable SSL for the database connection.',
        format: Boolean,
        default: process.env.NODE_ENV === 'production'
      }
    },
    hooks: {
      beforeConnect: {
        doc: 'Database connection hook.',
        format: '*',
        default: {}
      }
    },
    retry: {
      backoffBase: {
        doc: 'The base backoff time in milliseconds.',
        format: 'int',
        default: 500
      },
      backoffExponent: {
        doc: 'The backoff time exponent.',
        format: '*',
        default: 1.1
      },
      match: {
        doc: 'The error types to match.',
        format: Array,
        default: [/SequelizeConnectionError/]
      },
      max: {
        doc: 'The maximum number of retries.',
        format: 'int',
        default: 10
      },
      name: {
        doc: 'The retry name.',
        format: String,
        default: 'connection'
      },
      timeout: {
        doc: 'The retry timeout in milliseconds.',
        format: 'int',
        default: 60000
      }
    },
    define: {
      timestamps: {
        doc: 'Enable timestamps for the database records.',
        format: Boolean,
        default: false
      }
    }
  },
  cache: {
    segment: {
      doc: 'The cache segment name.',
      format: String,
      default: 'payments'
    },
    expiresIn: {
      doc: 'The cache expiration time in milliseconds.',
      format: 'int',
      default: 15 * 60 * 1000 // 15 minutes
    },
    useRedis: {
      doc: 'Use Redis for the cache instead of in memory cache',
      format: Boolean,
      default: process.env.NODE_ENV !== 'test'
    },
    catbox: {
      host: {
        doc: 'The cache host.',
        format: String,
        default: null,
        env: 'REDIS_HOSTNAME'
      },
      port: {
        doc: 'The cache port.',
        format: 'port',
        default: 6379,
        env: 'REDIS_PORT'
      },
      password: {
        doc: 'The cache password.',
        format: String,
        default: process.env.NODE_ENV === 'production' ? null : undefined,
        env: 'REDIS_PASSWORD'
      },
      partition: {
        doc: 'The cache partition.',
        format: String,
        default: 'ffc-mpdp-backend',
        env: 'REDIS_PARTITION'
      },
      tls: {
        doc: 'Enable TLS for the cache connection.',
        format: '*',
        default: process.env.NODE_ENV === 'production' ? {} : undefined
      }
    }
  }
})

config.validate({ allowed: 'strict' })

module.exports = config
