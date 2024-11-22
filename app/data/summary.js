const { AsyncParser } = require('@json2csv/node')
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

  const parser = new AsyncParser({ fields })
  return parser.parse(sortedPayments).promise()
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
