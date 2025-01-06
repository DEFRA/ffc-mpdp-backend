jest.mock('../../app/config')
const config = require('../../app/config')

jest.mock('@hapi/catbox-redis', () => ({
  Engine: jest.fn()
}))
const CatboxRedis = require('@hapi/catbox-redis')

jest.mock('@hapi/catbox-memory', () => ({
  Engine: jest.fn()
}))
const CatboxMemory = require('@hapi/catbox-memory')

const mockServer = {
  cache: jest.fn()
}

const mockCache = {
  get: jest.fn(),
  set: jest.fn(),
  drop: jest.fn()
}

const { getProvider, setup, get, set, clear } = require('../../app/cache')

describe('cache', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProvider', () => {
    test('should return Catbox Redis provider when Redis enabled', () => {
      config.get.mockImplementation(key => key === 'cache.useRedis' ? true : 'test-options')

      const provider = getProvider()
      expect(provider.provider.constructor).toBe(CatboxRedis.Engine)
    })

    test('should return Catbox options from config when Redis enabled', () => {
      config.get.mockImplementation(key => key === 'cache.useRedis' ? true : 'test-options')

      const provider = getProvider()
      expect(provider.provider.options).toBe('test-options')
    })

    test('should return Catbox Memory provider when Redis disabled', () => {
      config.get.mockImplementation(key => key === 'cache.useRedis' ? false : 'test-options')

      const provider = getProvider()
      expect(provider.provider.constructor).toBe(CatboxMemory.Engine)
    })

    test('should return Catbox options as empty object when Redis disabled', () => {
      config.get.mockImplementation(key => key === 'cache.useRedis' ? false : 'test-options')

      const provider = getProvider()
      expect(provider.provider.options).toEqual({})
    })
  })

  describe('setup', () => {
    const mockConfig = {
      'cache.segment': 'test-segment',
      'cache.expiresIn': 'test-expiresIn'
    }

    beforeEach(() => {
      config.get.mockImplementation(key => mockConfig[key])
    })

    test('should create a new cache instance on server', () => {
      setup(mockServer)
      expect(mockServer.cache).toHaveBeenCalledTimes(1)
    })

    test('should create a new cache instance with segment name from config', () => {
      setup(mockServer)
      expect(mockServer.cache).toHaveBeenCalledWith(expect.objectContaining({
        segment: 'test-segment'
      }))
    })

    test('should create a new cache instance with expiration time from config', () => {
      setup(mockServer)
      expect(mockServer.cache).toHaveBeenCalledWith(expect.objectContaining({
        expiresIn: 'test-expiresIn'
      }))
    })
  })

  describe('get', () => {
    beforeEach(() => {
      setup({ cache: () => mockCache })
    })

    test('should call cache get method with key', async () => {
      mockCache.get.mockResolvedValue('test-value')

      const value = await get('test-key')
      expect(value).toBe('test-value')
    })
  })

  describe('set', () => {
    beforeEach(() => {
      setup({ cache: () => mockCache })
    })

    test('should call cache set method with key and value', async () => {
      await set('test-key', 'test-value')
      expect(mockCache.set).toHaveBeenCalledWith('test-key', 'test-value')
    })
  })

  describe('clear', () => {
    beforeEach(() => {
      setup({ cache: () => mockCache })
    })

    test('should call cache drop method with key', async () => {
      await clear('test-key')
      expect(mockCache.drop).toHaveBeenCalledWith('test-key')
    })
  })
})
