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
  const groupedResults = groupByPayee(filteredResults)
  const sortedResults = getSortedResults(groupedResults, sortBy).map(r => r.item)
  const offsetResults = sortedResults.slice(offset, parseInt(offset) + parseInt(limit))

  return {
    count: groupedResults.length,
    rows: removeFilterFields(offsetResults)
  }
}

const performSearch = async (searchKey) => {
  const paymentData = await getAllPaymentData()
  const fuse = new Fuse(paymentData, fuseSearchOptions)
  return fuse.search(searchKey)
}

const getSortedResults = (records, sortBy) => {
  if (!sortBy || sortBy === 'score') {
    console.log(records)
    return records.sort((r1, r2) => (r1.score === r2.score) ? (r1.refIndex > r2.refIndex ? 1 : -1) : (r1.score > r2.score ? 1 : -1))
  }

  if (config.search.fields.includes(sortBy)) {
    return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
  }

  return records
}

const applyFilters = (searchResults, { schemes = [] }) => {
  if (!schemes || !schemes.length) return searchResults
  return searchResults.filter(x => schemes.includes(x.item.scheme))
}

const groupByPayee = (searchResults) => {
  const result = searchResults.reduce((acc, x) => {
    const payee = acc.find(r => r.item.payee_name === x.item.payee_name && r.item.part_postcode === x.item.part_postcode)
    if (!payee) {
      acc.push({ ...x })
    } else {
      payee.item.total_amount = parseFloat(payee.item.total_amount) + parseFloat(x.item.total_amount)
    }

    return acc
  }, [])

  return result
}

const removeFilterFields = (searchResults) => searchResults.map(({ scheme, ...rest }) => rest)

module.exports = { getPaymentData }
