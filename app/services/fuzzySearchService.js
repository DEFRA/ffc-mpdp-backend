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
  if (field === 'score') {
    return records
  }
  if (field === 'payee_name') {
    return records.sort((r1, r2) => r1.payee_name > r2.payee_name ? 1 : -1)
  }
  if (field === 'town') {
    return records.sort((r1, r2) => r1.town > r2.town ? 1 : -1)
  }
  if (field === 'part_postcode') {
    return records.sort((r1, r2) => r1.part_postcode > r2.part_postcode ? 1 : -1)
  }
  if (field === 'county_council') {
    return records.sort((r1, r2) => r1.county_council > r2.county_council ? 1 : -1)
  }
  return records
}

async function getPaymentData (searchKey, limit, offset, searchBy) {
  if (!searchKey) throw new Error('Empty search content')

  const cachedData = await getCachedPaymentData()

  // do search here
  const fuse = new Fuse(cachedData, fuseSearchOptions)
  const result = fuse.search(searchKey)
  const resultCount = result.length
  if (resultCount < 1) return []
  const filteredItems = result.map(row => row.item)
  const sortedItems = getSortedValue(filteredItems, searchBy)
  const end = offset + parseInt(limit)
  const offsetBlock = sortedItems.slice(offset, end)

  return { count: resultCount, rows: offsetBlock }
}

module.exports = { getPaymentData }
