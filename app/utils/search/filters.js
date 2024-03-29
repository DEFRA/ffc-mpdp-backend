const applyFiltersAndGroupByPayee = (
  searchResults,
  { schemes = [], counties = [], amounts = [], years = [] }
) => {
  let results = filterBySchemes(searchResults, schemes)
  results = filterByCounties(results, counties)
  results = filterByYears(results, years)
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

const filterByYears = (results, years) => {
  if (!years || !years.length) {
    return results
  }

  return results.filter(x => years.includes(x.financial_year))
}

const removeSchemeField = (searchResults) => searchResults.map(({ scheme, ...rest }) => rest)

const getFilterOptions = (searchResults) => {
  if (!searchResults || !searchResults.length) {
    return { schemes: [], amounts: [], counties: [], years: [] }
  }

  return {
    schemes: getUniqueFields(searchResults, 'scheme'),
    counties: getUniqueFields(searchResults, 'county_council'),
    amounts: getUniqueFields(groupByPayee(searchResults), 'total_amount'),
    years: getUniqueFields(searchResults, 'financial_year')
  }
}

const getUniqueFields = (searchResults, field) => {
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

module.exports = { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee }
