jest.mock('../../../../app/data/database')
const { getAllPayments } = require('../../../../app/data/database')

const { getPaymentData, getSearchSuggestions } = require('../../../../app/data/search')

getAllPayments.mockResolvedValue([
  { payee_name: 'payee name 1', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 1', financial_year: '20/21', total_amount: 100 },
  { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 2', financial_year: '20/21', total_amount: 200 },
  { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 1', financial_year: '20/21', total_amount: 300 },
  { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 2', financial_year: '20/21', total_amount: 400 },
  { payee_name: 'payee name 3', part_postcode: 'part postcode', town: 'town', county_council: 'county council', scheme: 'scheme 1', financial_year: '21/22', total_amount: 500 }
])

describe('search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPaymentData', () => {
    test('should return search results as an object', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 10, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data).toBeInstanceOf(Object)
    })

    test('should return count of search results', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 10, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data.count).toBe(3)
    })

    test('should return search results as an array', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 10, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data.rows).toBeInstanceOf(Array)
    })

    test('should return filter options', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 10, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data.filterOptions).toBeInstanceOf(Object)
    })

    test('should return results grouped by payee name', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 10, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data.count).toBe(3)
      expect(data.rows.find(x => x.payee_name === 'payee name 1')).toBeDefined()
      expect(data.rows.find(x => x.payee_name === 'payee name 2')).toBeDefined()
      expect(data.rows.find(x => x.payee_name === 'payee name 3')).toBeDefined()
    })

    test('should sum total amount for each payee name', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 10, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data.rows.find(x => x.payee_name === 'payee name 1').total_amount).toBe(100)
      expect(data.rows.find(x => x.payee_name === 'payee name 2').total_amount).toBe(900)
      expect(data.rows.find(x => x.payee_name === 'payee name 3').total_amount).toBe(500)
    })

    test('should return all results if action is download', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 1, offset: 0, sortBy: 'score', filterBy: {}, action: 'download' })
      expect(data.count).toBe(3)
    })

    test('should not offset results if action is download', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 1, offset: 1, sortBy: 'score', filterBy: {}, action: 'download' })
      expect(data.rows.length).toBe(3)
    })

    test('should paginate results if action is not download', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 1, offset: 0, sortBy: 'score', filterBy: {} })
      expect(data.rows.length).toBe(1)
      expect(data.rows[0].payee_name).toBe('payee name 1')
    })

    test('should offset results if action is not download and offset is greater than 0', async () => {
      const data = await getPaymentData({ searchString: 'payee name', limit: 1, offset: 1, sortBy: 'score', filterBy: {} })
      expect(data.rows.length).toBe(1)
      expect(data.rows[0].payee_name).toBe('payee name 2')
    })
  })

  describe('getSearchSuggestions', () => {
    test('should return search suggestions as an array', async () => {
      const data = await getSearchSuggestions('payee name')
      expect(data).toBeInstanceOf(Object)
    })
  })
})
