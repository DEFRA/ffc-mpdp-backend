const { applyFiltersAndGroupByPayee, getFilterOptions, groupByPayee } = require('../../../../../app/utils/search/filters')
const { removeFilterFields } = require('../../../../utils/helpers')

describe('applyFiltersAndGroupByPayee', () => {
  test('should return all results if no filters are applied', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200' }
    ]
    const filterBy = {}
    const result = applyFiltersAndGroupByPayee(searchResults, filterBy)
    expect(result).toEqual(removeFilterFields(searchResults))
  })

  test('should return results filtered by schemes', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200' }
    ]
    const filterBy = { schemes: ['scheme1'] }
    const result = applyFiltersAndGroupByPayee(searchResults, filterBy)
    expect(result).toEqual(removeFilterFields([searchResults[0]]))
  })

  test('should return results filtered by amounts', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200' }
    ]
    const filterBy = { amounts: ['101-'] }
    const result = applyFiltersAndGroupByPayee(searchResults, filterBy)
    expect(result).toEqual(removeFilterFields([searchResults[1]]))
  })

  test('should return results filtered by counties', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200', county_council: 'county2' }
    ]
    const filterBy = { counties: ['county1'] }
    const result = applyFiltersAndGroupByPayee(searchResults, filterBy)
    expect(result).toEqual(removeFilterFields([searchResults[0]]))
  })

  test('should return results filtered by schemes, amounts and counties', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200', county_council: 'county2' }
    ]
    const filterBy = { schemes: ['scheme2'], amounts: ['101-'], counties: ['county2'] }
    const result = applyFiltersAndGroupByPayee(searchResults, filterBy)
    expect(result).toEqual(removeFilterFields([searchResults[1]]))
  })

  test('should return results grouped by payee', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '200', county_council: 'county2' }
    ]
    const filterBy = {}
    const result = applyFiltersAndGroupByPayee(searchResults, filterBy)
    expect(result).toEqual([{ payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: 300, county_council: 'county1' }])
  })

  test('should return results filtered by schemes, amounts and counties and grouped by payee', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee1', part_postcode: 'part_postcode2', total_amount: '200', county_council: 'county2' }
    ]
    const filterBy = { schemes: ['scheme1'], amounts: ['100-'], counties: ['county1'] }
    const result = applyFiltersAndGroupByPayee(searchResults, filterBy)
    expect(result).toEqual([{ payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' }])
  })
})

describe('getFilterOptions', () => {
  test('should return schemes, amounts and counties', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200', county_council: 'county2' }
    ]
    const result = getFilterOptions(searchResults)
    expect(result).toEqual({
      schemes: ['scheme1', 'scheme2'],
      amounts: ['100', '200'],
      counties: ['county1', 'county2']
    })
  })

  test('should return schemes, amounts and counties without duplicates', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200', county_council: 'county2' },
      { scheme: 'scheme2', payee_name: 'payee3', part_postcode: 'part_postcode3', total_amount: '200', county_council: 'county2' },
      { scheme: 'Scheme2', payee_name: 'payee3', part_postcode: 'part_postcode3', total_amount: '200', county_council: 'county2' }
    ]
    const result = getFilterOptions(searchResults)
    expect(result).toEqual({
      schemes: ['scheme1', 'scheme2'],
      amounts: ['100', '200', '400'],
      counties: ['county1', 'county2']
    })
  })

  test('should return default values when no search results', () => {
    const searchResults = []
    const result = getFilterOptions(searchResults)
    expect(result).toEqual({
      schemes: [],
      amounts: [],
      counties: []
    })
  })

  test('should return default values when no search results', () => {
    const result = getFilterOptions(null)
    expect(result).toEqual({
      schemes: [],
      amounts: [],
      counties: []
    })
  })

  test('should return empty filterOptions for any fields that throws an error', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee2', part_postcode: 'part_postcode2', total_amount: '200', county_council: 'county2' },
      { scheme: 'scheme2', payee_name: 'payee3', part_postcode: 'part_postcode3', county_council: 'county2' }
    ]
    const result = getFilterOptions(searchResults)
    expect(result).toEqual({
      schemes: ['scheme1', 'scheme2'],
      amounts: [],
      counties: ['county1', 'county2']
    })
  })
})

describe('groupByPayee', () => {
  test('should return results grouped by payee', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '200', county_council: 'county2' }
    ]
    const result = groupByPayee(searchResults)
    expect(result).toEqual([{ scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: 300, county_council: 'county1' }])
  })

  test('should return results grouped by payee without duplicates', () => {
    const searchResults = [
      { scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '100', county_council: 'county1' },
      { scheme: 'scheme2', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '200', county_council: 'county2' },
      { scheme: 'scheme3', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: '200', county_council: 'county2' }
    ]
    const result = groupByPayee(searchResults)
    expect(result).toEqual([{ scheme: 'scheme1', payee_name: 'payee1', part_postcode: 'part_postcode1', total_amount: 500, county_council: 'county1' }])
  })

  test('should return empty array when no search results', () => {
    const searchResults = []
    const result = groupByPayee(searchResults)
    expect(result).toEqual([])
  })
})
