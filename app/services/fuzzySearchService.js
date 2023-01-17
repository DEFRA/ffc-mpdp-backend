const Fuse = require('fuse.js')
const { getAllPaymentData } = require('../services/databaseService')

// Locally cached data
let localCachedData = null
async function getCachedPaymentData () {
  if (!localCachedData) {
    localCachedData = await getAllPaymentData()
  }
  return localCachedData
}

// search configuration
const fuseSearchOptions = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: true,
  keys: ['payee_name', 'part_postcode', 'town', 'county_council']
}

// Sort the records
function getSortedValue (records, field) {
  const keys = ['payee_name', 'part_postcode', 'town', 'county_council']
  if (keys.includes(field)) {
    return records.sort((r1, r2) => r1[field] > r2[field] ? 1 : -1)
  }
  return records
}

async function getPaymentData (searchKey, limit, offset, sortBy) {
  if (!searchKey) throw new Error('Empty search content')

  const cachedData = await getCachedPaymentData()

  // do search here
  const fuse = new Fuse(cachedData, fuseSearchOptions)
  const result = fuse.search(searchKey)
  const resultCount = result.length
  if (resultCount < 1) return { count: 0, rows: [] }
  const filteredItems = result.map(row => row.item)
  const sortedItems = getSortedValue(filteredItems, sortBy)
  const end = parseInt(offset) + parseInt(limit)
  const offsetBlock = sortedItems.slice(offset, end)
  return { count: resultCount, rows: offsetBlock }
}

module.exports = { getPaymentData }
