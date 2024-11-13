const allPaymentDataFields = [
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

const search = {
  results: {
    fieldsToExtract: ['payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year'],
    fieldsToSearch: ['payee_name', 'part_postcode', 'town', 'county_council'],
    suggestionResultsLimit: 6
  },
  details: {
    fieldsToExtract: allPaymentDataFields.slice(0, -1) // Remove amount
  }
}

module.exports = {
  search
}
