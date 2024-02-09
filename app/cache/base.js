const hoek = require('@hapi/hoek')
const config = require('../config/appConfig').cacheConfig
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
  const value = await cache?.get(key)
  return value ?? {}
}

const set = async (cacheName, key, value) => {
  console.log('Set: Getting Cache')
  const cache = getCache(cacheName)
  console.log('Set: Setting Cache')
  await cache?.set(key, value)
  console.log('Set: Cache Set')
}

const update = async (cacheName, key, object) => {
  const existing = await get(cacheName, key)
  hoek.merge(existing, object, { mergeArrays: false })
  await set(cacheName, key, existing)
}

const clear = async (cacheName, key) => {
  const cache = getCache(cacheName)
  await cache?.drop(key)
}

const getCache = (cacheName) => {
  console.log('Finding Cache')
  const cache = cacheStore.find(cache => cache.name === cacheName)
  console.log('Find complete')
  if (!cache) {
    console.log('No Cache found, throwing error')
    throw new Error(`Cache ${cacheName} does not exist`)
  }

  console.log('Returning found cache')
  return cache?.cache || {}
}

module.exports = {
  setup,
  get,
  set,
  update,
  clear
}
