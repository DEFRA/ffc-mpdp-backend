const { Parser } = require('json2csv')
const { getAllPayments } = require('./database')
const { getPaymentData } = require('./search')

/*
Not current in use in front end due to workaround.  Needs updating to stream responses to client
*/

async function getPaymentsCsv ({ searchString, limit, offset, sortBy, filterBy, action = 'download' }) {
  const fields = [
    'payee_name',
    'part_postcode',
    'town',
    'county_council',
    'amount'
  ]
  const { rows: payments } = await getPaymentData({ searchString, limit, offset, sortBy, filterBy, action })
  const paymentsWithAmounts = payments.map(x => ({ ...x, amount: getReadableAmount(parseFloat(x.total_amount)) }))
  const csvParser = new Parser({ fields })
  return csvParser.parse(paymentsWithAmounts)
}

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
  const payments = await getAllPayments()
  const csvParser = new Parser({ fields })
  return csvParser.parse(payments)
}

function getReadableAmount (amount) {
  if (typeof amount !== 'number') {
    return '0'
  }

  return amount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

module.exports = {
  getPaymentsCsv,
  getAllPaymentsCsv
}
