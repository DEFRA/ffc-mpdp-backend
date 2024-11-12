const cache = require('../../../../app/cache')
const { createServer } = require('../../../../app/server')
const testCacheName = 'testCache'
const testCacheName2 = 'testCache2'
let server

jest.mock('../../../../app/config/cache', () => ({
  segments: {
    testCache: {
      name: testCacheName,
      expiresIn: 300 * 1000 // 5 minutes
    },
    testCache2: {
      name: testCacheName2,
      expiresIn: 300 * 1000 // 5 minutes
    }
  },
  redisCatboxOptions: {}
}))

beforeAll(async () => {
  server = await createServer()
  await server.initialize()
})

afterAll(async () => {
  await server.stop()
  jest.clearAllMocks()
})

describe('base caching', () => {
  test('sets up all segments from the config', async () => {
    await expect(cache.get(testCacheName, 'NonExistentTestKey')).resolves.not.toThrowError()
    await expect(cache.get(testCacheName2, 'NonExistentTestKey')).resolves.not.toThrowError()
  })

  test('Throws an error when non existent cache is retrieved', async () => {
    const cacheName = 'NonExistentCacheName'
    await expect(cache.get(cacheName, 'NonExistentTestKey')).rejects.toThrow(`Cache ${cacheName} does not exist`)
  })

  test('sets and gets string value', async () => {
    await cache.set(testCacheName, 'testKey', 'testValue')
    const result = await cache.get(testCacheName, 'testKey')
    expect(result).toBe('testValue')
  })

  test('sets and gets object value', async () => {
    await cache.set(testCacheName, 'testKey', { value: 'testValue' })
    const result = await cache.get(testCacheName, 'testKey')
    expect(result).toStrictEqual({ value: 'testValue' })
  })

  test('updates object value', async () => {
    await cache.set(testCacheName, 'testKey', { value: 'testValue' })
    await cache.update(testCacheName, 'testKey', { nextValue: 'testValue2' })
    const result = await cache.get(testCacheName, 'testKey')
    expect(result).toStrictEqual({
      value: 'testValue',
      nextValue: 'testValue2'
    })
  })

  test('updates object value with array', async () => {
    await cache.set(testCacheName, 'testKey', { value: 'testValue' })
    await cache.update(testCacheName, 'testKey', { nextValue: ['testValue2'] })
    const result = await cache.get(testCacheName, 'testKey')
    expect(result).toStrictEqual({
      value: 'testValue',
      nextValue: ['testValue2']
    })
  })

  test('updates object value replacing array without merging', async () => {
    await cache.set(testCacheName, 'testKey', { value: ['testValue'] })
    await cache.update(testCacheName, 'testKey', { value: ['testValue2'] })
    const result = await cache.get(testCacheName, 'testKey')
    expect(result).toStrictEqual({ value: ['testValue2'] })
  })

  test('updates object value replaces value', async () => {
    await cache.set(testCacheName, 'testKey', { value: 'testValue' })
    await cache.update(testCacheName, 'testKey', { value: 'testValue2' })
    const result = await cache.get(testCacheName, 'testKey')
    expect(result).toStrictEqual({ value: 'testValue2' })
  })

  test('segments by cache name', async () => {
    await cache.set(testCacheName, 'testKey', 'testValue')
    await cache.set(testCacheName2, 'testKey', 'testValue2')
    const result = await cache.get(testCacheName, 'testKey')
    const result2 = await cache.get(testCacheName2, 'testKey')
    expect(result).toBe('testValue')
    expect(result2).toBe('testValue2')
  })

  test('returns empty object if key does not exist', async () => {
    const result = await cache.get(testCacheName, 'NonExistentTestKey')
    expect(result).toStrictEqual({})
  })

  test('clears cache based on key', async () => {
    await cache.set(testCacheName, 'testKey', 'testValue')
    const result = await cache.get(testCacheName, 'testKey')
    expect(result).toBe('testValue')

    await cache.clear(testCacheName, 'testKey')
    await expect(cache.get(testCacheName, 'testKey')).resolves.toStrictEqual({})
  })
})
