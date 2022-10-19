const csvFile = 'app/data/mpdp-data-file.csv'
module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: (request, res) => {
    return res.file(csvFile, { mode: 'attachment', type: 'text/csv' })
  }
}
