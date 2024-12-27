jest.mock('../../../../app/data/database')
const { getAllPayments } = require('../../../../app/data/database')

const { getPaymentData, getSearchSuggestions } = require('../../../../app/data/search')

getAllPayments.mockResolvedValue([
  { payee_name: 'payee name 1', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 1', financial_year: '20/21', total_amount: 100 },
  { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 2', financial_year: '20/21', total_amount: 200 },
  { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 1', financial_year: '20/21', total_amount: 300 },
  { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 2', financial_year: '20/21', total_amount: 400 },
  { payee_name: 'payee name 3', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 1', financial_year: '21/22', total_amount: 500 },
  { payee_name: 'payee name 3', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 2', financial_year: '21/22', total_amount: 600 }
])

describe('search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPaymentData', () => {
    test('should return search results as an object', async () => {
      const data = await getPaymentData({ searchString: 'payee name 1', limit: 10, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data).toBeInstanceOf(Object)
    })
  })

  describe('getSearchSuggestions', () => {
    test('should return search suggestions as an array', async () => {
      const data = await getSearchSuggestions('payee name')
      expect(data).toBeInstanceOf(Object)
    })
  })
})
