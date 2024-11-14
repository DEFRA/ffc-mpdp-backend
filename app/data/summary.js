const { Parser } = require('json2csv')
const { getAnnualPayments } = require('../data/database')

async function getPaymentSummary () {
  const payments = await getAnnualPayments()
  return groupPaymentsByYear(payments)
}

async function getPaymentSummaryCsv () {
  const fields = [
    'financial_year',
    'scheme',
    {
      label: 'amount',
      value: 'total_amount'
    }
  ]
  const payments = await getAnnualPayments()
  const sortedPayments = payments.toSorted((a, b) => a.financial_year > b.financial_year ? 1 : -1)

  const csvParser = new Parser({ fields })
  return csvParser.parse(sortedPayments)
}

function groupPaymentsByYear (payments) {
  return payments.reduce((acc, item) => {
    if (!acc[item.financial_year]) {
      acc[item.financial_year] = []
    }
    acc[item.financial_year].push(item)
    return acc
  }, {})
}

module.exports = {
  getPaymentSummary,
  getPaymentSummaryCsv
}
