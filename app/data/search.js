const Fuse = require('fuse.js')
const { getAllPayments } = require('./database')
const { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee } = require('../utils/search/filters')

const options = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: false,
  keys: ['payee_name', 'part_postcode', 'town', 'county_council']
}

const suggestionResultsLimit = 6

async function getPaymentData ({ searchString, limit, offset, sortBy, filterBy, action }) {
  const searchResults = await search(searchString)
  const filteredResults = applyFiltersAndGroupByPayee(searchResults, filterBy)
  if (!filteredResults.length) {
    return { count: 0, rows: [], filterOptions: getFilterOptions(searchResults) }
  }

  let sortedResults = getSortedResults(filteredResults, sortBy)
  if (action !== 'download') {
    sortedResults = sortedResults.slice(offset, offset + limit)
  }

  return {
    count: filteredResults.length,
    rows: sortedResults,
    filterOptions: getFilterOptions(searchResults)
  }
}

async function getSearchSuggestions (searchString) {
  const searchResults = await search(searchString)
  const groupedResults = groupByPayee(searchResults)
  return {
    count: groupedResults.length,
    rows: groupedResults
      .map(({ scheme, total_amount, financial_year, ...rest }) => rest) // eslint-disable-line camelcase
      .slice(0, suggestionResultsLimit)
  }
}

async function search (searchString) {
  const paymentData = await getAllPayments()
  const fuse = new Fuse(paymentData, options)
  return fuse.search(searchString).map(row => row.item)
}

function getSortedResults (records, sortBy) {
  if (sortBy && sortBy !== 'score' && options.keys.includes(sortBy)) {
    return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
  }

  return records
}

module.exports = {
  getPaymentData,
  getSearchSuggestions
}
