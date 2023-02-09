const Fuse = require('fuse.js')

const { getAllPaymentData } = require('../services/databaseService')
const config = require('../config/appConfig')

// search configuration
const fuseSearchOptions = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: true,
  keys: config.search.fields
}

const getPaymentData = async ({ searchString, limit, offset, sortBy, filterBy }) => {
  if (!searchString) throw new Error('Empty search content')

  const searchResults = await performSearch(searchString)
  if (!searchResults.length) {
    return { count: 0, rows: [] }
  }

  const filteredResults = applyFilters(searchResults, filterBy)
  const sortedResults = getSortedResults(filteredResults, sortBy)
  const offsetResults = sortedResults.slice(offset, parseInt(offset) + parseInt(limit))

  return {
    count: filteredResults.length,
    rows: removeFilterFields(offsetResults)
  }
}

const performSearch = async (searchKey) => {
  const paymentData = await getAllPaymentData()
  const fuse = new Fuse(paymentData, fuseSearchOptions)
  return fuse.search(searchKey).map(row => row.item)
}

const getSortedResults = (records, sortBy) => {
  if (sortBy && sortBy !== 'score') {
    if (config.search.fields.includes(sortBy)) {
      return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
    }
  }
  return records
}

const applyFilters = (searchResults, { schemes = [] }) => {
  if (!schemes || !schemes.length) return searchResults
  return searchResults.filter(x => schemes.includes(x.scheme))
}

const removeFilterFields = (searchResults) => searchResults.map(({ scheme, ...rest }) => rest)

module.exports = { getPaymentData }
