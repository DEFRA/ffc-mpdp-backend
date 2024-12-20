describe('cache config', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NODE_ENV = 'test'
    process.env.REDIS_HOSTNAME = 'test-redis-hostname'
    process.env.REDIS_PORT = 6000
    process.env.REDIS_PASSWORD = 'test-redis-password'
    process.env.REDIS_PARTITION = 'test-redis-partition'
  })

  test('should return segment as payments', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('segment')).toBe('payments')
  })

  test('should return expiresIn as 15 minutes in milliseconds', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('expiresIn')).toBe(900000)
  })

  test('should return useRedis as true if Node environment is development', () => {
    process.env.NODE_ENV = 'development'
    const config = require('../../../app/config/cache')
    expect(config.get('useRedis')).toBe(true)
  })

  test('should return useRedis as true if Node environment is production', () => {
    process.env.NODE_ENV = 'production'
    const config = require('../../../app/config/cache')
    expect(config.get('useRedis')).toBe(true)
  })

  test('should return useRedis as false if Node environment is test', () => {
    process.env.NODE_ENV = 'test'
    const config = require('../../../app/config/cache')
    expect(config.get('useRedis')).toBe(false)
  })

  test('should return useRedis as true if Node environment is not one of development, test or production', () => {
    process.env.NODE_ENV = 'something-else'
    const config = require('../../../app/config/cache')
    expect(config.get('useRedis')).toBe(true)
  })

  test('should return useRedis as true if Node environment is not provided', () => {
    delete process.env.NODE_ENV
    const config = require('../../../app/config/cache')
    expect(config.get('useRedis')).toBe(true)
  })

  test('should return catbox options for Redis as an object', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('catbox')).toBeInstanceOf(Object)
  })

  test('should return Redis host name if environment variable is provided', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.host')).toBe('test-redis-hostname')
  })

  test('should throw error if Redis host name is not provided in environment variable', () => {
    delete process.env.REDIS_HOSTNAME
    expect(() => {
      require('../../../app/config/cache')
    }).toThrow()
  })

  test('should return Redis port if environment variable is provided', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.port')).toBe(6000)
  })

  test('should default to port 6379 if Redis port is not provided in environment variable', () => {
    delete process.env.REDIS_PORT
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.port')).toBe(6379)
  })

  test('should return Redis password if environment variable is provided', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.password')).toBe('test-redis-password')
  })

  test('should not throw error if Redis password is not provided in environment variable and environment is not production', () => {
    delete process.env.REDIS_PASSWORD
    expect(() => {
      require('../../../app/config/cache')
    }).not.toThrow()
  })

  test('should return undefined for Redis password if environment variable is not provided and environment is not production', () => {
    delete process.env.REDIS_PASSWORD
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.password')).toBeUndefined()
  })

  test('should throw error if Redis password is not provided in environment variable and environment is production', () => {
    process.env.NODE_ENV = 'production'
    delete process.env.REDIS_PASSWORD
    expect(() => {
      require('../../../app/config/cache')
    }).toThrow()
  })

  test('should return Redis partition if environment variable is provided', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.partition')).toBe('test-redis-partition')
  })

  test('should default to ffc-mpdp-backend for Redis partition if environment variable is not provided', () => {
    delete process.env.REDIS_PARTITION
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.partition')).toBe('ffc-mpdp-backend')
  })

  test('should return TLS options for Redis as an object if environment is production', () => {
    process.env.NODE_ENV = 'production'
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.tls')).toBeInstanceOf(Object)
  })

  test('should return TLS options as empty object if environment is production', () => {
    process.env.NODE_ENV = 'production'
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.tls')).toEqual({})
  })

  test('should return undefined for TLS options for Redis if environment is not production', () => {
    const config = require('../../../app/config/cache')
    expect(config.get('catbox.tls')).toBeUndefined()
  })
})
