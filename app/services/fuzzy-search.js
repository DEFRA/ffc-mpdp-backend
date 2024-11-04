const Fuse = require('fuse.js')

const { getAllPaymentData } = require('./database')
const { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee } = require('../utils/search/filters')

const { search: { results } } = require('../config/app')

// search configuration
const fuseSearchOptions = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: false,
  keys: results.fieldsToSearch
}

const getPaymentData = async ({ searchString, limit, offset, sortBy, filterBy, action }) => {
  if (!searchString) {
    throw new Error('Empty search content')
  }

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
    if (results.fieldsToSearch.includes(sortBy)) {
      return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
    }
  }
  return records
}

const getSearchSuggestions = async (searchString) => {
  const searchResults = groupByPayee(await search(searchString))
  return {
    count: searchResults.length,
    rows: searchResults
      .map(({ scheme, total_amount, financial_year, ...rest }) => rest) // eslint-disable-line camelcase
      .slice(0, results.suggestionResultsLimit)
  }
}

module.exports = { getPaymentData, getSearchSuggestions }
