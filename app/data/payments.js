const { Parser } = require('json2csv')
const { getAllPaymentData } = require('./database')

/*
Not current in use in front end due to workaround.  Needs updating to stream responses to client
*/
async function getAllPaymentsCsv () {
  const fields = [
    'financial_year',
    'payee_name',
    'part_postcode',
    'town',
    'county_council',
    'parliamentary_constituency',
    'scheme',
    'scheme_detail',
    'amount'
  ]
  const paymentData = await getAllPaymentData()
  const csvParser = new Parser({ fields })
  return csvParser.parse(paymentData)
}

module.exports = {
  getAllPaymentsCsv
}
