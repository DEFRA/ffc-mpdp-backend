const convict = require('convict')

const config = convict({
  host: {
    doc: 'The database host',
    format: String,
    default: null,
    env: 'POSTGRES_HOST'
  },
  port: {
    doc: 'The database port',
    format: 'port',
    default: 5432,
    env: 'POSTGRES_PORT'
  },
  username: {
    doc: 'The database username',
    format: String,
    default: null,
    env: 'POSTGRES_USERNAME'
  },
  password: {
    doc: 'The database password',
    format: String,
    default: null,
    env: 'POSTGRES_PASSWORD'
  },
  schema: {
    doc: 'The database schema',
    format: String,
    default: 'public',
    env: 'POSTGRES_SCHEMA_NAME'
  },
  database: {
    doc: 'The database name',
    format: String,
    default: null,
    env: 'POSTGRES_DB'
  },
  logging: {
    doc: 'Enable database logging',
    format: Boolean,
    default: false
  },
  dialect: {
    doc: 'The database dialect',
    format: String,
    default: 'postgres'
  },
  dialectOptions: {
    ssl: {
      doc: 'Enable SSL for the database connection',
      format: Boolean,
      default: process.env.NODE_ENV === 'production'
    }
  },
  retry: {
    backoffBase: {
      doc: 'The base backoff time in milliseconds',
      format: 'int',
      default: 500
    },
    backoffExponent: {
      doc: 'The backoff time exponent',
      format: Number,
      default: 1.1
    },
    match: {
      doc: 'The error types to match',
      format: Array,
      default: [/SequelizeConnectionError/]
    },
    max: {
      doc: 'The maximum number of retries',
      format: 'int',
      default: 10
    },
    name: {
      doc: 'The retry name',
      format: String,
      default: 'connection'
    },
    timeout: {
      doc: 'The retry timeout in milliseconds',
      format: 'int',
      default: 60 * 1000
    }
  },
  define: {
    timestamps: {
      doc: 'Enable timestamps for the database records',
      format: Boolean,
      default: false
    }
  }
})

config.validate({ allowed: 'strict' })

module.exports = config
