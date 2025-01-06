const { Readable } = require('stream')
const { AsyncParser } = require('@json2csv/node')
const { getAllPaymentsByPage } = require('./database')
const { getPaymentData } = require('./search')

async function getPaymentsCsv ({ searchString, limit, offset, sortBy, filterBy, action = 'download' }) {
  const fields = [
    'payee_name',
    'part_postcode',
    'town',
    'county_council',
    'amount'
  ]
  const { rows: payments } = await getPaymentData({ searchString, limit, offset, sortBy, filterBy, action })
  const paymentsWithAmounts = payments.map(x => ({ ...x, amount: getReadableAmount(x.total_amount) }))
  const parser = new AsyncParser({ fields })
  return parser.parse(paymentsWithAmounts).promise()
}

function getAllPaymentsCsvStream () {
  const fields = [
    'financial_year',
    'payee_name',
    'part_postcode',
    'town',
    'county_council',
    'parliamentary_constituency',
    'scheme',
    'scheme_detail',
    {
      label: 'amount',
      value: 'total_amount'
    }
  ]

  let page = 1

  const paymentStream = new Readable({
    read (_size) {
      getAllPaymentsByPage(page)
        .then(payments => {
          if (payments.length === 0) {
            this.push(null)
            return
          }

          const parser = new AsyncParser({ fields, header: page === 1 })
          parser.parse(payments).promise()
            .then(parsed => {
              this.push(parsed)
              this.push('\n')
              page++
            })
            .catch(err => {
              console.error(err)
              this.destroy(err)
            })
        })
        .catch(err => {
          console.error(err)
          this.destroy(err)
        })
    }
  })

  return paymentStream
}

function getReadableAmount (amount) {
  const floatAmount = parseFloat(amount)

  if (isNaN(floatAmount)) {
    return '0.00'
  }

  return floatAmount.toFixed(2)
}

module.exports = {
  getPaymentsCsv,
  getAllPaymentsCsvStream
}
