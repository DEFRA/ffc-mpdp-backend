const isAscending = (arr, key) => arr.every((x, i) => x[key] <= arr[i][key])

const isInRange = (amount, range) => {
  const [from, to] = range.split('-')
  const amountF = parseFloat(amount)
  return amountF >= parseFloat(from) && amountF <= parseFloat(to)
}

const removeFilterFields = (searchResults) => searchResults.map(({ scheme, ...rest }) => rest)

module.exports = { isAscending, isInRange, removeFilterFields }
