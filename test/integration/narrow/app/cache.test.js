const cache = require('../../../../app/cache')
const { createServer } = require('../../../../app/server')

let server

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
    await expect(cache.get('NonExistentTestKey')).resolves.not.toThrowError()
    await expect(cache.get('NonExistentTestKey')).resolves.not.toThrowError()
  })

  test('sets and gets string value', async () => {
    await cache.set('testKey', 'testValue')
    const result = await cache.get('testKey')
    expect(result).toBe('testValue')
  })

  test('sets and gets object value', async () => {
    await cache.set('testKey', { value: 'testValue' })
    const result = await cache.get('testKey')
    expect(result).toStrictEqual({ value: 'testValue' })
  })

  test('returns null if key does not exist', async () => {
    const result = await cache.get('NonExistentTestKey')
    expect(result).toStrictEqual(null)
  })

  test('clears cache based on key', async () => {
    await cache.set('testKey', 'testValue')
    const result = await cache.get('testKey')
    expect(result).toBe('testValue')

    await cache.clear('testKey')
    await expect(cache.get('testKey')).resolves.toStrictEqual(null)
  })
})
