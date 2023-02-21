const isAscending = (arr, key) => arr.every((x, i) => x[key] <= arr[i][key])

module.exports = { isAscending }
