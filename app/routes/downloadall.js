const { Parser } = require('json2csv')
const { getRawData } = require('../services/databaseService')

const cache = require('../cache')
const config = require('../config/appConfig')

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request, res) => {
    try {
      console.log('Getting CSV from cache')
      let csvData = await cache.get(config.cacheConfig.segments.csvData.name, 'csvData')
      if (!csvData || !Object.keys(csvData).length) {
        console.log('Cached CSV not found, generating CSV.')
        const paymentData = await getRawData()
        csvData = new Parser({ fields: config.csvFields }).parse(paymentData)
        console.log('CSV generated')
        await cache.set(config.cacheConfig.segments.csvData.name, 'csvData', csvData)
      }

      console.log('Sending csv back')
      return res.response(csvData)
        .type('text/csv')
        .header('Connection', 'keep-alive')
        .header('Cache-Control', 'no-cache')
        .header('Content-Disposition', 'attachment;filename=ffc-payment-data.csv')
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
