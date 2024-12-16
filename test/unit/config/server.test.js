describe('server config', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.HOST = '1.1.1.1'
    process.env.PORT = 6000
  })

  test('should return host from environment variable', () => {
    const config = require('../../../app/config/server')
    expect(config.get('host')).toBe('1.1.1.1')
  })

  test('should default host to 0.0.0.0 if not provided in environment variable', () => {
    delete process.env.HOST
    const config = require('../../../app/config/server')
    expect(config.get('host')).toBe('0.0.0.0')
  })

  test('should throw error if host is not an IP address', () => {
    process.env.HOST = 'invalid-ip-address'
    expect(() => require('../../../app/config/server')).toThrow()
  })

  test('should return port from environment variable', () => {
    const config = require('../../../app/config/server')
    expect(config.get('port')).toBe(6000)
  })

  test('should default port to 3000 if not provided in environment variable', () => {
    delete process.env.PORT
    const config = require('../../../app/config/server')
    expect(config.get('port')).toBe(3000)
  })

  test('should throw error if port is not a number', () => {
    process.env.PORT = 'invalid-port'
    expect(() => require('../../../app/config/server')).toThrow()
  })

  test('should throw error if port is not a valid port number', () => {
    process.env.PORT = 99999
    expect(() => require('../../../app/config/server')).toThrow()
  })
})
