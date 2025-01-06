const config = require('./config')
let cache

function getProvider () {
  const Catbox = config.get('cache.useRedis') ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
  const catboxOptions = config.get('cache.useRedis') ? config.get('cache.catbox') : {}
  return {
    provider: {
      constructor: Catbox.Engine,
      options: catboxOptions
    }
  }
}

function setup (server) {
  cache = server.cache({
    segment: config.get('cache.segment'),
    expiresIn: config.get('cache.expiresIn')
  })
}

async function get (key) {
  return cache.get(key)
}

async function set (key, value) {
  await cache.set(key, value)
}

async function clear (key) {
  await cache.drop(key)
}

module.exports = {
  getProvider,
  setup,
  get,
  set,
  clear
}
