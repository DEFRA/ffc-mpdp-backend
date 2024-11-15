const Fuse = require('fuse.js')
const { getAllPayments } = require('./database')
const { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee } = require('../utils/search/filters')

// search configuration
const fieldsToSearch = ['payee_name', 'part_postcode', 'town', 'county_council']

const fuseSearchOptions = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: false,
  keys: fieldsToSearch
}

const suggestionResultsLimit = 6

async function getPaymentData ({ searchString, limit, offset, sortBy, filterBy, action }) {
  if (!searchString) {
    throw new Error('Empty search content')
  }

  const searchResults = await search(searchString)
  const filteredResults = applyFiltersAndGroupByPayee(searchResults, filterBy)
  if (!filteredResults.length) {
    return { count: 0, rows: [], filterOptions: getFilterOptions(searchResults) }
  }

  let sortedResults = getSortedResults(filteredResults, sortBy)
  if (action !== 'download') {
    sortedResults = sortedResults.slice(offset, parseInt(offset) + parseInt(limit))
  }

  return {
    count: filteredResults.length,
    rows: sortedResults,
    filterOptions: getFilterOptions(searchResults)
  }
}

async function search (searchString) {
  const paymentData = await getAllPayments()
  const fuse = new Fuse(paymentData, fuseSearchOptions)
  return fuse.search(searchString).map(row => row.item)
}

function getSortedResults (records, sortBy) {
  if (sortBy && sortBy !== 'score' && fieldsToSearch.includes(sortBy)) {
    return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
  }

  return records
}

async function getSearchSuggestions (searchString) {
  const searchResults = groupByPayee(await search(searchString))
  return {
    count: searchResults.length,
    rows: searchResults
      .map(({ scheme, total_amount, financial_year, ...rest }) => rest) // eslint-disable-line camelcase
      .slice(0, suggestionResultsLimit)
  }
}

module.exports = {
  getPaymentData,
  getSearchSuggestions
}
