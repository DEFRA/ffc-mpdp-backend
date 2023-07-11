const Fuse = require('fuse.js')

const { getAllPaymentData } = require('../services/databaseService')
const { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee } = require('../utils/search/filters')

const config = require('../config/appConfig')

// search configuration
const fuseSearchOptions = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: false,
  keys: config.search.fieldsToSearch
}

const getPaymentData = async ({ searchString, limit, offset, sortBy, filterBy, action }) => {
  if (!searchString) throw new Error('Empty search content')

  const searchResults = await search(searchString)
  const filteredResults = applyFiltersAndGroupByPayee(searchResults, filterBy)
  if (!filteredResults.length) {
    return { count: 0, rows: [], filterOptions: getFilterOptions(searchResults) }
  }

  let results = getSortedResults(filteredResults, sortBy)
  if (action !== 'download') {
    results = results.slice(offset, parseInt(offset) + parseInt(limit))
  }

  return {
    count: filteredResults.length,
    rows: results,
    filterOptions: getFilterOptions(searchResults)
  }
}

const search = async (searchString) => {
  const paymentData = await getAllPaymentData()
  const fuse = new Fuse(paymentData, fuseSearchOptions)
  return fuse.search(searchString).map(row => row.item)
}

const getSortedResults = (records, sortBy) => {
  if (sortBy && sortBy !== 'score') {
    if (config.search.fieldsToSearch.includes(sortBy)) {
      return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
    }
  }
  return records
}

let cachedGroupedPaymentData = null
const getSearchSuggestions = async (searchKey) => {
  if (!cachedGroupedPaymentData) {
    const paymentData = await getAllPaymentData()
    cachedGroupedPaymentData = groupByPayee(paymentData)

    // eslint-disable-next-line camelcase
    cachedGroupedPaymentData = cachedGroupedPaymentData.map(({ scheme, total_amount, ...rest }) => rest)
  }
  const fuse = new Fuse(cachedGroupedPaymentData, fuseSearchOptions)
  const searchResult = fuse.search(searchKey).map(row => row.item)
  return {
    count: searchResult.length,
    rows: searchResult.slice(0, config.search.suggestionResultsLimit)
  }
}

module.exports = { getPaymentData, getSearchSuggestions }
