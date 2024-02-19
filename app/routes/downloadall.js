const { getRawData } = require('../services/databaseService')
const { AsyncParser } = require('@json2csv/node')

const cache = require('../cache')
const config = require('../config/appConfig')

module.exports = {
  method: 'GET',
  path: '/downloadall',
  handler: async (_request, res) => {
    try {
      let csvData = await cache.get(config.cacheConfig.segments.csvData.name, 'csvData')
      if (!csvData || !Object.keys(csvData).length) {
        console.log('Cached CSV not found, generating CSV data.')
        const paymentData = await getRawData()
        csvData = JSON.stringify(paymentData)
        console.log('Caching CSV data')
        await cache.set(config.cacheConfig.segments.csvData.name, 'csvData', csvData)
      }

      const parser = new AsyncParser({ fields: config.csvFields })
      const stream = parser.parse(csvData)
      return res.response(stream)
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
