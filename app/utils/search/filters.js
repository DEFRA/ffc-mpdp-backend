const applyFiltersAndGroupByPayee = (
  searchResults,
  { schemes = [], counties = [], amounts = [] }
) => {
  let results = filterBySchemes(searchResults, schemes)
  results = filterByCounties(results, counties)
  results = groupByPayee(results)
  results = filterByAmounts(results, amounts)
  return removeSchemeField(results)
}

const filterBySchemes = (results, schemes) => {
  if (!schemes || !schemes.length) {
    return results
  }
  return results.filter((x) =>
    schemes
      .map((scheme) => scheme.toLowerCase())
      .includes(x.scheme.toLowerCase())
  )
}

const filterByAmounts = (results, amounts) => {
  if (!amounts || !amounts.length) {
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

const filterByCounties = (searchResults, counties) => {
  if (!counties || !counties.length) return searchResults
  const lowerCaseCounties = counties.map((county) => county.toLowerCase())
  return searchResults.filter((x) =>
    lowerCaseCounties.includes(x.county_council.toLowerCase())
  )
}

const groupByPayee = (searchResults) => {
  const result = searchResults.reduce((acc, x) => {
    const payee = acc.find(
      (r) =>
        r.payee_name === x.payee_name && r.part_postcode === x.part_postcode
    )
    if (!payee) {
      acc.push({ ...x })
    } else {
      payee.total_amount = parseFloat(payee.total_amount) + parseFloat(x.total_amount)
    }

    return acc
  }, [])

  return result
}

const removeSchemeField = (searchResults) => searchResults.map(({ scheme, ...rest }) => rest)

const getFilterOptions = (searchResults) => {
  if (!searchResults || !searchResults.length) {
    return { schemes: [], amounts: [], counties: [] }
  }

  return {
    schemes: getUniqueFields(searchResults, 'scheme'),
    counties: getUniqueFields(searchResults, 'county_council'),
    amounts: getUniqueFields(groupByPayee(searchResults), 'total_amount')
  }
}

const getUniqueFields = (searchResults, field) => {
  return searchResults.reduce((acc, result) => {
    if (acc.findIndex((y) => {y.toLowerCase() === result[field].toLowerCase()}) != -1) {
      acc.push(result[field])
    }
    return acc
  }, [])
  // return Array.from(new Set(searchResults.map((result) => result[field])))
}

module.exports = { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee }
