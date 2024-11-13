const cacheConfig = require('./config')
let cache

function setup (server) {
  cache = server.cache({
    segment: cacheConfig.get('cache.segment'),
    expiresIn: cacheConfig.get('cache.expiresIn')
  })
}

async function get (key) {
  const value = await cache.get(key)
  return value ?? {}
}

async function set (key, value) {
  await cache.set(key, value)
}

async function clear (key) {
  await cache.drop(key)
}

module.exports = {
  setup,
  get,
  set,
  clear
}
