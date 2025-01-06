jest.mock('@hapi/hapi', () => ({
  server: jest.fn().mockImplementation(() => ({
    validator: jest.fn(),
    register: jest.fn(),
    route: jest.fn()
  }))
}))
const Hapi = require('@hapi/hapi')

const mockConfig = {
  'server.host': '0.0.0.0',
  'server.port': 3000
}

jest.mock('../../app/config', () => ({
  get: jest.fn().mockImplementation(key => mockConfig[key])
}))

jest.mock('../../app/cache', () => ({
  getProvider: jest.fn().mockReturnValue({ provider: {} }),
  setup: jest.fn()
}))
const cache = require('../../app/cache')

jest.mock('joi')
const Joi = require('joi')

jest.mock('../../app/plugins', () => ({
  registerPlugins: jest.fn()
}))
const { registerPlugins } = require('../../app/plugins')

const { createServer } = require('../../app/server')

describe('createServer', () => {
  let server

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
  })

  test('should return a new server instance', () => {
    expect(server).toBeDefined()
  })

  test('should set the server host', () => {
    expect(Hapi.server).toHaveBeenCalledWith(expect.objectContaining({
      host: '0.0.0.0'
    }))
  })

  test('should set the server port', () => {
    expect(Hapi.server).toHaveBeenCalledWith(expect.objectContaining({
      port: 3000
    }))
  })

  test('should set the server validation options to not abort validation early', () => {
    expect(Hapi.server).toHaveBeenCalledWith(expect.objectContaining({
      routes: {
        validate: {
          options: {
            abortEarly: false
          }
        }
      }
    }))
  })

  test('should set the server to strip trailing slashes from route requests', () => {
    expect(Hapi.server).toHaveBeenCalledWith(expect.objectContaining({
      router: {
        stripTrailingSlash: true
      }
    }))
  })

  test('should set the server cache provider to the cache provider', () => {
    expect(cache.getProvider).toHaveBeenCalledTimes(1)
    expect(Hapi.server).toHaveBeenCalledWith(expect.objectContaining({
      cache: [{ provider: {} }]
    }))
  })

  test('should setup the cache', () => {
    expect(cache.setup).toHaveBeenCalledWith(server)
  })

  test('should set the server validator to Joi', () => {
    expect(server.validator).toHaveBeenCalledWith(Joi)
  })

  test('should register plugins', () => {
    expect(registerPlugins).toHaveBeenCalledWith(server)
  })
})
