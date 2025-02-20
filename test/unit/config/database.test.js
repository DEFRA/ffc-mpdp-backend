describe('database config', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.POSTGRES_HOST = 'test-postgres-host'
    process.env.POSTGRES_PORT = 6000
    process.env.POSTGRES_USERNAME = 'test-postgres-username'
    process.env.POSTGRES_PASSWORD = 'test-postgres-password'
    process.env.POSTGRES_SCHEMA_NAME = 'test-postgres-schema'
    process.env.POSTGRES_DB = 'test-postgres-db'
  })

  test('should return host from environment variable', () => {
    const config = require('../../../app/config/database')
    expect(config.get('host')).toBe('test-postgres-host')
  })

  test('should throw error if host is not provided in environment variable', () => {
    delete process.env.POSTGRES_HOST
    expect(() => require('../../../app/config/database')).toThrow()
  })

  test('should return port from environment variable', () => {
    const config = require('../../../app/config/database')
    expect(config.get('port')).toBe(6000)
  })

  test('should return port as 5432 if not provided in environment variable', () => {
    delete process.env.POSTGRES_PORT
    const config = require('../../../app/config/database')
    expect(config.get('port')).toBe(5432)
  })

  test('should return username from environment variable', () => {
    const config = require('../../../app/config/database')
    expect(config.get('username')).toBe('test-postgres-username')
  })

  test('should throw error if username is not provided in environment variable', () => {
    delete process.env.POSTGRES_USERNAME
    expect(() => require('../../../app/config/database')).toThrow()
  })

  test('should return password from environment variable', () => {
    const config = require('../../../app/config/database')
    expect(config.get('password')).toBe('test-postgres-password')
  })

  test('should return undefined for password if not provided in environment variable', () => {
    delete process.env.POSTGRES_PASSWORD
    const config = require('../../../app/config/database')
    expect(config.get('password')).toBeUndefined()
  })

  test('should not throw error if password is not provided in environment variable', () => {
    delete process.env.POSTGRES_PASSWORD
    expect(() => require('../../../app/config/database')).not.toThrow()
  })

  test('should return schema name from environment variable', () => {
    const config = require('../../../app/config/database')
    expect(config.get('schema')).toBe('test-postgres-schema')
  })

  test('should return schema name as public if not provided in environment variable', () => {
    delete process.env.POSTGRES_SCHEMA_NAME
    const config = require('../../../app/config/database')
    expect(config.get('schema')).toBe('public')
  })

  test('should return database name from environment variable', () => {
    const config = require('../../../app/config/database')
    expect(config.get('database')).toBe('test-postgres-db')
  })

  test('should throw error if database name is not provided in environment variable', () => {
    delete process.env.POSTGRES_DB
    expect(() => require('../../../app/config/database')).toThrow()
  })

  test('should return logging as true', () => {
    const config = require('../../../app/config/database')
    expect(config.get('logging')).toBe(true)
  })

  test('should return dialect as postgres', () => {
    const config = require('../../../app/config/database')
    expect(config.get('dialect')).toBe('postgres')
  })

  test('should return dialect options as an object', () => {
    const config = require('../../../app/config/database')
    expect(config.get('dialectOptions')).toBeInstanceOf(Object)
  })

  test('should return dialect ssl as false if environment is not production', () => {
    const config = require('../../../app/config/database')
    expect(config.get('dialectOptions.ssl')).toBe(false)
  })

  test('should return dialect ssl as true if environment is production', () => {
    process.env.NODE_ENV = 'production'
    const config = require('../../../app/config/database')
    expect(config.get('dialectOptions.ssl')).toBe(true)
  })

  test('should return retry as an object', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry')).toBeInstanceOf(Object)
  })

  test('should return retry back off base time as 500 milliseconds', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry.backoffBase')).toBe(500)
  })

  test('should return retry back off exponent as 1.1', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry.backoffExponent')).toBe(1.1)
  })

  test('should return retry match as an array', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry.match')).toBeInstanceOf(Array)
  })

  test('should return retry match including SequelizeConnectionError', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry.match')).toEqual([/SequelizeConnectionError/])
  })

  test('should return retry max as 10', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry.max')).toBe(10)
  })

  test('should return retry name as connection', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry.name')).toBe('connection')
  })

  test('should return retry timeout as 60000 milliseconds', () => {
    const config = require('../../../app/config/database')
    expect(config.get('retry.timeout')).toBe(60000)
  })

  test('should return define as an object', () => {
    const config = require('../../../app/config/database')
    expect(config.get('define')).toBeInstanceOf(Object)
  })

  test('should return define timestamps as false', () => {
    const config = require('../../../app/config/database')
    expect(config.get('define.timestamps')).toBe(false)
  })
})
