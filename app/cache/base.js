const hoek = require('@hapi/hoek');
const config = require('../config/appConfig').cacheConfig;
let paymentDataCache;

const setup = (server) => {
	paymentDataCache = server.cache({
		expiresIn: config.paymentDataSegment.expiresIn,
		segment: config.paymentDataSegment.name,
	});
};

const get = async (cacheName, key) => {
	const cache = getCache(cacheName);
	const value = await cache.get(key);
	return value ?? {};
};

const set = async (cacheName, key, value) => {
	const cache = getCache(cacheName);
	await cache.set(key, value);
};

const update = async (cacheName, key, object) => {
	const existing = await get(cacheName, key);
	hoek.merge(existing, object, { mergeArrays: false });
	await set(cacheName, key, existing);
};

const clear = async (cacheName, key) => {
	const cache = getCache(cacheName);
	await cache.drop(key);
};

const getCache = (cacheName) => {
	switch (cacheName) {
		case config.paymentDataSegment.name:
			return paymentDataCache;
		default:
			throw new Error(`Cache ${cacheName} does not exist`);
	}
};

module.exports = {
	setup,
	get,
	set,
	update,
	clear,
};
