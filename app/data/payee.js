const { Parser } = require('json2csv')
const { getPayeePayments } = require('./database')

async function getPayeeDetails (payeeName, partPostcode) {
  const payments = await getPayeePayments(payeeName, partPostcode)

  if (!payments.length) {
    return undefined
  }

  return {
    payee_name: payments[0].payee_name,
    payee_name2: payments[0].payee_name,
    part_postcode: payments[0].part_postcode,
    town: payments[0].town,
    county_council: payments[0].county_council,
    parliamentary_constituency: payments[0].parliamentary_constituency,
    schemes: payments.map(payment => {
      return {
        name: payment.scheme,
        detail: payment.scheme_detail,
        activity_level: payment.activity_level,
        amount: payment.amount,
        financial_year: payment.financial_year
      }
    })
  }
}

async function getPayeeDetailsCsv (payeeName, partPostcode) {
  const csvFields = [
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
  const paymentData = await getPayeePayments(payeeName, partPostcode)
  const csvParser = new Parser({ fields: csvFields })
  return csvParser.parse(paymentData)
}

module.exports = {
  getPayeeDetails,
  getPayeeDetailsCsv
}
