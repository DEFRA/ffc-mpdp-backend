const mockConfig = {
  getProperties: jest.fn().mockReturnValue({ mock: 'config' })
}

jest.mock('../../../app/config/cache', () => (mockConfig))
jest.mock('../../../app/config/database', () => (mockConfig))
jest.mock('../../../app/config/server', () => (mockConfig))

describe('config', () => {
  beforeEach(() => {
    jest.resetModules()

    process.env.NODE_ENV = 'test'
  })

  test('should return environment from environment variable', () => {
    const config = require('../../../app/config')
    expect(config.get('env')).toBe('test')
  })

  test.each(['production', 'development', 'test'])('should allow %s as environment name', (env) => {
    process.env.NODE_ENV = env
    expect(() => require('../../../app/config')).not.toThrow()
  })

  test('should throw error if environment is not one of production, development or test', () => {
    process.env.NODE_ENV = 'something-else'
    expect(() => require('../../../app/config')).toThrow()
  })

  test('should return isProd as true if environment is production', () => {
    process.env.NODE_ENV = 'production'
    const config = require('../../../app/config')
    expect(config.get('isProd')).toBe(true)
  })

  test.each(['development', 'test'])('should return isProd as false if environment is %s', (env) => {
    process.env.NODE_ENV = env
    const config = require('../../../app/config')
    expect(config.get('isProd')).toBe(false)
  })

  test('should add server config', () => {
    const config = require('../../../app/config')
    expect(config.get('server')).toEqual({ mock: 'config' })
  })

  test('should add database config', () => {
    const config = require('../../../app/config')
    expect(config.get('db')).toEqual({ mock: 'config' })
  })

  test('should add cache config', () => {
    const config = require('../../../app/config')
    expect(config.get('cache')).toEqual({ mock: 'config' })
  })
})
