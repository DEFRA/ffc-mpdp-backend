const Fuse = require('fuse.js')

const { getAllPaymentData } = require('../services/databaseService')
const config = require('../config/appConfig')

// search configuration
const fuseSearchOptions = {
  includeScore: true,
  threshold: 0.3,
  ignoreLocation: true,
  useExtendedSearch: true,
  keys: config.search.fieldsToSearch
}

const getPaymentData = async ({ searchString, limit, offset, sortBy, filterBy }) => {
  if (!searchString) throw new Error('Empty search content')

  const searchResults = await filterAndSearch(searchString, filterBy)
  if (!searchResults.length) {
    return { count: 0, rows: [] }
  }

  const groupedResults = groupByPayee(searchResults)
  const sortedResults = getSortedResults(groupedResults, sortBy)
  const offsetResults = sortedResults.slice(offset, parseInt(offset) + parseInt(limit))

  return {
    count: sortedResults.length,
    rows: removeFilterFields(offsetResults)
  }
}

const filterAndSearch = async (searchKey, filters) => {
  const paymentData = await getAllPaymentData()
  const filteredData = applyFilters(paymentData, filters)
  const fuse = new Fuse(filteredData, fuseSearchOptions)
  return fuse.search(searchKey).map(row => row.item)
}

const getSortedResults = (records, sortBy) => {
  if (sortBy && sortBy !== 'score') {
    if (config.search.fieldsToSearch.includes(sortBy)) {
      return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
    }
  }
  return records
}

const applyFilters = (searchResults, { schemes = [] }) => {
  if (!schemes || !schemes.length) return searchResults
  return searchResults.filter(x => schemes.includes(x.scheme))
}

const groupByPayee = (searchResults) => {
  const result = searchResults.reduce((acc, x) => {
    const payee = acc.find(r => r.payee_name === x.payee_name && r.part_postcode === x.part_postcode)
    if (!payee) {
      acc.push({ ...x })
    } else {
      payee.total_amount = parseFloat(payee.total_amount) + parseFloat(x.total_amount)
    }

    return acc
  }, [])

  return result
}

const removeFilterFields = (searchResults) => searchResults.map(({ scheme, ...rest }) => rest)

module.exports = { getPaymentData }
