const { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee, removeKeys } = require('../../../app/data/filters')

const searchResults = [
  { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 100, scheme: 'scheme 1', financial_year: '20/21' },
  { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 200, scheme: 'scheme 2', financial_year: '20/21' }
]

describe('filters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('applyFiltersAndGroupByPayee', () => {
    test('should grouped payee data', () => {
      const data = applyFiltersAndGroupByPayee(searchResults, {})
      expect(data).toEqual([
        { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 300, financial_year: '20/21' }
      ])
    })

    test('should remove scheme from grouped payee data', () => {
      const data = applyFiltersAndGroupByPayee(searchResults, {})
      expect(data).toEqual([
        { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 300, financial_year: '20/21' }
      ])
    })

    test('should filter by schemes', () => {
      const data = applyFiltersAndGroupByPayee(searchResults, { schemes: ['scheme 1'] })
      expect(data).toEqual([
        { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 100, financial_year: '20/21' }
      ])
    })

    test('should filter by amounts', () => {
      const additionalSearchResults = [...searchResults, { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 500 }]
      const data = applyFiltersAndGroupByPayee(additionalSearchResults, { amounts: ['0-300'] })
      expect(data).toEqual([
        { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 300, financial_year: '20/21' }
      ])
    })

    test('should filter by counties', () => {
      const additionalSearchResults = [...searchResults, { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council 2', total_amount: 500 }]
      const data = applyFiltersAndGroupByPayee(additionalSearchResults, { counties: ['county council'] })
      expect(data).toEqual([
        { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 300, financial_year: '20/21' }
      ])
    })

    test('should filter by years', () => {
      const additionalSearchResults = [...searchResults, { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council 2', total_amount: 500, financial_year: '21/22' }]
      const data = applyFiltersAndGroupByPayee(additionalSearchResults, { years: ['21/22'] })
      expect(data).toEqual([
        { payee_name: 'payee name 2', part_postcode: 'part postcode', town: 'town', county_council: 'county council 2', total_amount: 500, financial_year: '21/22' }
      ])
    })

    test('should return empty array if no search results', () => {
      const data = applyFiltersAndGroupByPayee([], {})
      expect(data).toEqual([])
    })

    test('should return empty array if no search results after filtering', () => {
      const data = applyFiltersAndGroupByPayee(searchResults, { schemes: ['scheme 3'] })
      expect(data).toEqual([])
    })
  })

  describe('getFilterOptions', () => {
    test('should return unique values', () => {
      const data = getFilterOptions(searchResults)
      expect(data).toEqual({
        amounts: ['300'],
        schemes: ['scheme 1', 'scheme 2'],
        years: ['20/21'],
        counties: ['county council']
      })
    })

    test('should return empty object if no search results', () => {
      const data = getFilterOptions([])
      expect(data).toEqual({ amounts: [], schemes: [], years: [], counties: [] })
    })
  })

  describe('groupByPayee', () => {
    test('should group by payee', () => {
      const data = groupByPayee(searchResults)
      expect(data).toEqual([
        { payee_name: 'payee name', part_postcode: 'part postcode', town: 'town', county_council: 'county council', total_amount: 300, scheme: 'scheme 1', financial_year: '20/21' }
      ])
    })
  })

  describe('removeKeys', () => {
    test('should remove key if exists', () => {
      const result = removeKeys({ test: 'key' }, ['test'])
      expect(result).toEqual({})
    })

    test('should not remove key if not exists', () => {
      const result = removeKeys({ test: 'key' }, ['something'])
      expect(result).toEqual({ test: 'key' })
    })
  })
})
