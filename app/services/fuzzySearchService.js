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
  const data = await getAllPaymentData()
  const paymentData = await groupByPayee(data)

  const filteredData = applyFilters(paymentData, filters)
  // const fuse = new Fuse(filteredData, fuseSearchOptions)
  // return fuse.search(searchKey).map(row => row.item)
  return searchWithDelimiterComma(searchKey,paymentData)
  return searchWithDelimiterSpace(searchKey,paymentData)
}

// chris vel john ram
// results are added to next set

const searchWithDelimiterComma = async (searchKey, paymentData) => {
  // split the key by comma
  const keys = searchKey.split(' ')
  console.log("keys :" + keys)
  const fuse = new Fuse(paymentData, fuseSearchOptions)
  // loop through the keys and print the result

  let records = [];
  for (let i = 0; i < keys.length; i++) {
    // add the result to the array
    const result = fuse.search(keys[i])
    console.log(result)
    console.log(result.length)
    records = records.concat(result)
  }
  // console.log(records)
  const items =  records.map(row => row.item)
  return items
}

const searchWithDelimiterSpace = async (searchKey, paymentData) => {
  // split the key by comma
  const keys = searchKey.split(' ')
  console.log("keys :" + keys)
  const fuse = new Fuse(paymentData, fuseSearchOptions)
  // loop through the keys and print the result

  let records = [];
  for (let i = 0; i < keys.length; i++) {
    // add the result to the array
    const result = fuse.search(keys[i])
    console.log(result)
    console.log(result.length)
    records = records.concat(result)
  }
  // console.log(records)
  const items =  records.map(row => row.item)
  return items
}



const getSortedResults = (records, sortBy) => {
  if (sortBy && sortBy !== 'score') {
    if (config.search.fieldsToSearch.includes(sortBy)) {
      return records.sort((r1, r2) => r1[sortBy] > r2[sortBy] ? 1 : -1)
    }
  }
  return records
}

const applyFilters = (searchResults, { schemes = [], counties = [], amounts = [] }) => {
  let results = filterBySchemes(searchResults, schemes)
  results = filterByCounties(results, counties)
  results = filterByAmounts(results, amounts)

  return results
}

const filterBySchemes = (results, schemes) => {
  if (!schemes || !schemes.length) {
    return results
  }

  return results.filter(x => schemes.map(scheme => scheme.toLowerCase()).includes(x.scheme.toLowerCase()))
}

const filterByAmounts = (results, amounts) => {
  if (!amounts || !amounts.length) {
    return results
  }

  const amountRanges = amounts.map(x => {
    const [_from, _to] = x.split('-')
    return { from: parseFloat(_from), to: parseFloat(_to) }
  })

  return results.filter(x => {
    return amountRanges.some(({ from, to }) => {
      const totalAmount = parseFloat(x.total_amount)

      return (!to) ? (totalAmount >= from) : (totalAmount >= from && totalAmount <= to)
    })
  })
}

const filterByCounties = (searchResults, counties) => {
  if (!counties || !counties.length) return searchResults
  const lowerCaseCounties = counties.map(county => county.toLowerCase())
  return searchResults.filter(x => lowerCaseCounties.includes(x.county_council.toLowerCase()))
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
