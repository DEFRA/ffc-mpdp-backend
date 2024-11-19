function applyFiltersAndGroupByPayee (
  searchResults,
  { schemes = [], counties = [], amounts = [], years = [] }
) {
  const schemeFilteredResults = filterBySchemes(searchResults, schemes)
  const countyFilteredResults = filterByCounties(schemeFilteredResults, counties)
  const yearFilteredResults = filterByYears(countyFilteredResults, years)
  const groupedResults = groupByPayee(yearFilteredResults)
  const amountFilteredResults = filterByAmounts(groupedResults, amounts)
  return amountFilteredResults.map(result => removeKeys(result, ['scheme']))
}

function filterBySchemes (searchResults, schemes) {
  if (!schemes.length) {
    return searchResults
  }
  return searchResults.filter(result =>
    schemes.includes(result.scheme.toLowerCase())
  )
}

function filterByCounties (searchResults, counties) {
  if (!counties.length) {
    return searchResults
  }
  return searchResults.filter(result =>
    counties.includes(result.county_council.toLowerCase())
  )
}

function filterByYears (results, years) {
  if (!years.length) {
    return results
  }

  return results.filter(x => years.includes(x.financial_year))
}

function groupByPayee (searchResults) {
  const result = searchResults.reduce((acc, item) => {
    const payee = acc.find(r => r.payee_name === item.payee_name && r.part_postcode === item.part_postcode)

    if (!payee) {
      acc.push({ ...item })
    } else {
      payee.total_amount = parseFloat(payee.total_amount) + parseFloat(item.total_amount)
    }

    return acc
  }, [])

  return result
}

function filterByAmounts (searchResults, amounts) {
  if (!amounts.length) {
    return searchResults
  }
  const amountRanges = amounts.map((range) => {
    const [from, to] = range.split('-')
    return { from: parseFloat(from), to: parseFloat(to) }
  })

  return searchResults.filter(result => {
    return amountRanges.some(range => {
      const totalAmount = parseFloat(result.total_amount)
      return !range.to
        ? totalAmount >= range.from
        : totalAmount >= range.from && totalAmount <= range.to
    })
  })
}

function getFilterOptions (searchResults) {
  if (!searchResults.length) {
    return { schemes: [], amounts: [], counties: [], years: [] }
  }

  return {
    schemes: getUniqueFields(searchResults, 'scheme'),
    counties: getUniqueFields(searchResults, 'county_council'),
    amounts: getUniqueFields(groupByPayee(searchResults), 'total_amount'),
    years: getUniqueFields(searchResults, 'financial_year')
  }
}

function getUniqueFields (searchResults, field) {
  try {
    return searchResults.reduce((acc, result) => {
      if (!acc.length || acc.findIndex((y) =>
        y?.toString().toLowerCase() === result[field]?.toString().toLowerCase()) === -1) {
        acc.push(result[field].toString())
      }
      return acc
    }, [])
  } catch (error) {
    console.error(error)
    return []
  }
}

function removeKeys (obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  )
}

module.exports = {
  applyFiltersAndGroupByPayee,
  getFilterOptions,
  groupByPayee,
  removeKeys
}
