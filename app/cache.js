const hoek = require('@hapi/hoek')
const config = require('./config/app').cacheConfig
const cacheStore = []

const setup = (server) => {
  Object.keys(config.segments).forEach((key) => {
    const { name, expiresIn } = config.segments[key]
    cacheStore.push({
      name,
      cache: server.cache({
        expiresIn,
        segment: name
      })
    })
  })
}

const get = async (cacheName, key) => {
  const cache = getCache(cacheName)
  const value = await cache.get(key)
  return value ?? {}
}

const set = async (cacheName, key, value) => {
  const cache = getCache(cacheName)
  await cache.set(key, value)
}

const update = async (cacheName, key, object) => {
  const existing = await get(cacheName, key)
  hoek.merge(existing, object, { mergeArrays: false })
  await set(cacheName, key, existing)
}

const clear = async (cacheName, key) => {
  const cache = getCache(cacheName)
  await cache.drop(key)
}

const getCache = (cacheName) => {
  const cache = cacheStore.find(cacheItem => cacheItem.name === cacheName)
  if (!cache) {
    throw new Error(`Cache ${cacheName} does not exist`)
  }

  return cache.cache
}

module.exports = {
  setup,
  get,
  set,
  update,
  clear
}
