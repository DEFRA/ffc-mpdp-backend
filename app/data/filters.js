function applyFiltersAndGroupByPayee (
  searchResults,
  { schemes = [], counties = [], amounts = [], years = [] }
) {
  let results = filterBySchemes(searchResults, schemes)
  results = filterByCounties(results, counties)
  results = filterByYears(results, years)
  results = groupByPayee(results)
  results = filterByAmounts(results, amounts)
  return results.map(result => removeKeys(result, ['scheme']))
}

function filterBySchemes (results, schemes) {
  if (!schemes?.length) {
    return results
  }
  return results.filter((x) =>
    schemes
      .map((scheme) => scheme.toLowerCase())
      .includes(x.scheme.toLowerCase())
  )
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

function filterByAmounts (results, amounts) {
  if (!amounts?.length) {
    return results
  }
  const amountRanges = amounts.map((range) => {
    const [_from, _to] = range.split('-')
    return { from: parseFloat(_from), to: parseFloat(_to) }
  })
  return results.filter((row) => {
    return amountRanges.some(({ from, to }) => {
      const totalAmount = parseFloat(row.total_amount)
      return !to
        ? totalAmount >= from
        : totalAmount >= from && totalAmount <= to
    })
  })
}

function filterByCounties (searchResults, counties) {
  if (!counties?.length) {
    return searchResults
  }
  const lowerCaseCounties = counties.map((county) => county.toLowerCase())
  return searchResults.filter((x) =>
    lowerCaseCounties.includes(x.county_council.toLowerCase())
  )
}

function filterByYears (results, years) {
  if (!years?.length) {
    return results
  }

  return results.filter(x => years.includes(x.financial_year))
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
