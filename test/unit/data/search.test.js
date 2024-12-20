const { getPaymentData, getSearchSuggestions } = require('../../../app/data/search')
const { PaymentDataModel } = require('../../../app/data/database')
const paymentestdata = require('../../data/payment-test-data.json')
const { isAscending, isInRange } = require('../../utils/helpers')

jest.mock('../../../app/cache')
const { get } = require('../../../app/cache')

beforeAll(() => {
  jest.resetAllMocks()
  get.mockResolvedValue({})
})

describe('testing fuzzySearchService /paymentdata', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getPaymentData to be defined', () => {
    expect(getPaymentData).toBeDefined()
  })

  test('GET /paymentdata returns right data', async () => {
    const searchCriteria = {
      searchString: 'Farmer',
      limit: 20,
      offset: 0,
      sortBy: 'payee_bame',
      filterBy: {
        schemes: []
      }
    }

    const expectedData = {
      count: 2,
      rows: [
        {
          payee_name: 'Farmer1 Vel',
          part_postcode: 'PE15',
          town: 'March',
          county_council: 'Cambridgeshire',
          total_amount: '5853.00',
          financial_year: '21/22'
        },
        {
          payee_name: 'Farmer2  Vel',
          part_postcode: 'WS7',
          town: 'Hammerwich',
          county_council: 'Staffordshire',
          total_amount: '1472.00',
          financial_year: '22/23'
        }
      ],
      filterOptions: {
        schemes: ['Farming Equipment and Technology Fund', 'Sustainable Farming Incentive pilot'],
        counties: ['Cambridgeshire', 'Staffordshire'],
        amounts: ['5853.00', '1472.00'],
        years: ['21/22', '22/23']
      }
    }
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)

    const result = await getPaymentData(searchCriteria)
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdata returns right paginated data', async () => {
    const searchCriteria = {
      searchString: 'fa',
      limit: 5,
      offset: 0,
      sortBy: null,
      filterBy: {
        schemes: []
      }
    }
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)

    const result = await getPaymentData(searchCriteria)
    expect(result.count).toBe(11)
    expect(result.rows.length).toEqual(searchCriteria.limit)

    const result2 = await getPaymentData({ ...searchCriteria, offset: searchCriteria.limit })
    expect(result2.count).toEqual(11)
    expect(result.rows.length).toEqual(searchCriteria.limit)
  })

  test('GET /paymentdata returns all matching data without limit with download csv action', async () => {
    const searchCriteria = {
      searchString: 'a',
      limit: 5,
      offset: 0,
      sortBy: null,
      filterBy: {
        schemes: []
      }
    }
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)
    const fullData = 242

    const result = await getPaymentData(searchCriteria)
    expect(result.count).toBe(fullData)
    expect(result.rows.length).toEqual(searchCriteria.limit)

    const action = 'download'
    const result2 = await getPaymentData({ ...searchCriteria, action })
    expect(result2.count).toEqual(fullData)
    expect(result2.rows.length).toEqual(fullData)
  })

  test('GET /paymentdata returns expected content when filters selected with download csv action', async () => {
    const searchCriteria = {
      searchString: 'a',
      limit: 5,
      offset: 0,
      sortBy: null,
      filterBy: {
        schemes: []
      }
    }
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)
    const fullData = 242

    const action = 'download'
    const result = await getPaymentData({ ...searchCriteria, action })
    expect(result.count).toEqual(fullData)
    expect(result.rows.length).toEqual(fullData)

    const counties = ['staffordshire']
    const amounts = ['5000-9999']
    const filterBy = { counties, amounts }
    const filteredResult = await getPaymentData({ ...searchCriteria, filterBy, action })

    filteredResult.rows.forEach(row => {
      expect(isInRange(row.total_amount, amounts[0])).toBe(true)
      expect(row.county_council).toEqual('Staffordshire')
    })

    expect(filteredResult.count).toEqual(4)
    expect(filteredResult.rows.length).toEqual(4)
  })
})

describe('fuzzySearchService tests with sortBy', () => {
  const searchCriteria = {
    searchString: 'fa',
    limit: 5,
    offset: 0,
    sortBy: null,
    filterBy: {
      schemes: []
    }
  }

  const mockDb = jest.spyOn(PaymentDataModel, 'findAll')

  beforeEach(() => {
    mockDb.mockResolvedValue(paymentestdata)
  })

  test('GET /paymentdata sorts results by score by default', async () => {
    const result = await getPaymentData(searchCriteria)
    expect(result.rows[0].part_postcode).toEqual('PE15')
  })

  test('GET /paymentdata sorts results by payee name', async () => {
    const result = await getPaymentData({ ...searchCriteria, sortBy: 'payee_name' })
    expect(isAscending(result.rows, 'payee_name')).toBe(true)
  })

  test('GET /paymentdata sorts results by town', async () => {
    const result = await getPaymentData({ ...searchCriteria, sortBy: 'town' })
    expect(isAscending(result.rows, 'town')).toBe(true)
  })

  test('GET /paymentdata sorts results by part_postcode', async () => {
    const result = await getPaymentData({ ...searchCriteria, sortBy: 'part_postcode' })
    expect(isAscending(result.rows, 'part_postcode')).toBe(true)
  })

  test('GET /paymentdata sorts results by county_council', async () => {
    const result = await getPaymentData({ ...searchCriteria, sortBy: 'county_council' })
    expect(isAscending(result.rows, 'county_council')).toBe(true)
  })
})

describe('fuzzySearchService tests with filterBy', () => {
  const searchCriteria = {
    searchString: 'fa',
    limit: 5,
    offset: 0,
    sortBy: null,
    filterBy: {
      schemes: [],
      amounts: []
    }
  }

  test('GET /paymentdata returns default results with empty filters are provided provided', async () => {
    const results = await getPaymentData(searchCriteria)
    expect(results.count).toBeGreaterThan(0)
  })

  test('GET /paymentdata filters by single scheme', async () => {
    const schemes = ['Farming Equipment and Technology Fund']
    const filteredResult = await getPaymentData({ ...searchCriteria, filterBy: { schemes } })

    filteredResult.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(matchingSet.scheme).toBe(schemes[0])
    })
  })

  test('GET /paymentdata filters scheme while using case insensitive search', async () => {
    const schemes = ['farming equipment and technology fund']
    const filteredResult = await getPaymentData({ ...searchCriteria, filterBy: { schemes } })

    filteredResult.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(matchingSet.scheme).toBe('Farming Equipment and Technology Fund')
    })
  })

  test('GET /paymentdata filters by multiple schemes and pagination still works', async () => {
    const schemes = ['farming equipment and technology fund', 'sustainable farming incentive pilot']
    const filteredResultPage1 = await getPaymentData({ ...searchCriteria, filterBy: { schemes } })

    filteredResultPage1.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(schemes.includes(matchingSet.scheme.toLowerCase())).toBeTruthy()
    })

    // Check pagination works by setting the offset to previous search limit
    const filteredResultPage2 = await getPaymentData({ ...searchCriteria, offset: 5, filterBy: { schemes } })
    expect(filteredResultPage2.count).toBe(11)
    expect(filteredResultPage2.rows.length).toBe(5)
  })

  test('GET /paymentdata filters by single amount', async () => {
    const amounts = ['5000-9999']
    const filteredResult = await getPaymentData({ ...searchCriteria, filterBy: { amounts } })

    filteredResult.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(isInRange(matchingSet.total_amount, amounts[0])).toBe(true)
    })
  })

  test('GET /paymentdata filters by multiple amounts', async () => {
    const amounts = ['0-4999', '5000-9999']
    const filteredResult = await getPaymentData({ ...searchCriteria, filterBy: { amounts } })

    filteredResult.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(amounts.some(r => isInRange(matchingSet.total_amount, r))).toBeTruthy()
    })
  })

  test('GET /paymentdata filters by scheme and amount', async () => {
    const schemes = ['farming equipment and technology fund']
    const amounts = ['5000-9999']
    const filteredResult = await getPaymentData({ ...searchCriteria, filterBy: { schemes, amounts } })

    filteredResult.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(isInRange(matchingSet.total_amount, amounts[0])).toBe(true)
      expect(matchingSet.scheme).toBe('Farming Equipment and Technology Fund')
    })
  })

  test('GET /paymentdata filters by single county', async () => {
    const counties = ['Cambridgeshire']
    const filteredResult = await getPaymentData({ ...searchCriteria, filterBy: { counties } })

    filteredResult.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(matchingSet.county_council).toBe(counties[0])
    })
  })

  test('GET /paymentdata filters by multiple counties', async () => {
    const counties = ['Cambridgeshire', 'Staffordshire']
    const filteredResultPage = await getPaymentData({ ...searchCriteria, filterBy: { counties } })

    filteredResultPage.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(counties.includes(matchingSet.county_council)).toBeTruthy()
    })
  })

  test('GET /paymentdata filters by multiple  scheme, counties and amount', async () => {
    const schemes = ['Farming Equipment and Technology Fund']
    const counties = ['Cambridgeshire', 'Staffordshire']
    const amounts = ['5000-9999']
    const filterBy = { schemes, counties, amounts }
    const filteredResultPage = await getPaymentData({ ...searchCriteria, filterBy })

    filteredResultPage.rows.forEach(x => {
      const matchingSet = paymentestdata.find(td => td.payee_name === x.payee_name && td.part_postcode === x.part_postcode)
      expect(schemes.includes(matchingSet.scheme)).toBeTruthy()
      expect(counties.includes(matchingSet.county_council)).toBeTruthy()
      expect(matchingSet.scheme).toBe(schemes[0])
    })
  })
})

describe('fuzzySearchService tests for search suggestions', () => {
  const searchString = 'Farmer'
  test('GET /searchsuggestion returns right data', async () => {
    const expectedData = {
      count: 2,
      rows: [
        {
          payee_name: 'Farmer1 Vel',
          part_postcode: 'PE15',
          town: 'March',
          county_council: 'Cambridgeshire'
        },
        {
          payee_name: 'Farmer2  Vel',
          part_postcode: 'WS7',
          town: 'Hammerwich',
          county_council: 'Staffordshire'
        }
      ]
    }
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)

    const result = await getSearchSuggestions(searchString)
    expect(result).toEqual(expectedData)
  })

  test('GET /searchsuggestion returns 6 rows maximum', async () => {
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)
    const searchString = 'Farmer'
    const result = await getSearchSuggestions(searchString)
    expect(result.rows.length).toBeLessThanOrEqual(6)
  })
})
