const { getPaymentData } = require('../../../../app/services/fuzzySearchService')
const { PaymentDataModel } = require('../../../../app/services/databaseService')
const paymentestdata = require('./paymentestdata.json')

beforeAll(() => {
  jest.resetAllMocks()
})

describe('testing fuzzySearchService /paymentdata', () => {
  test('getPaymentData to be defined', () => {
    expect(getPaymentData).toBeDefined()
  })

  test('GET /paymentdata returns right data', async () => {
    const searchString = 'Farmer'
    const limit = 20
    const offset = 0
    const sortBy = 'payee_bame'
    const mockData = paymentestdata
    const expectedData = {
      count: 2,
      rows: [
        {
          payee_name: 'Farmer1 Vel',
          part_postcode: 'PE15',
          town: 'March',
          county_council: 'Cambridgeshire',
          total_amount: '5853.00'
        },
        {
          payee_name: 'Farmer2  Vel',
          part_postcode: 'WS7',
          town: 'Hammerwich',
          county_council: 'Staffordshire',
          total_amount: '1472.00'
        }
      ]
    }
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(mockData)
    const result = await getPaymentData(searchString, limit, offset, sortBy)
    expect(result.count).toEqual(2)
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdata returns right paginated data', async () => {
    const { getPaymentData } = require('../../../../app/services/fuzzySearchService')
    const searchString = 'fa'
    const limit = 10
    const offset = 0
    const searchBy = null
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)
    const result = await getPaymentData(searchString, limit, offset, searchBy)
    expect(result.count).toBeGreaterThan(10)
    expect(result.rows.length).toEqual(10)
    const result2 = await getPaymentData(searchString, 5, offset, searchBy)
    expect(result2.count).toEqual(11)
    expect(result2.rows.length).toEqual(5)
  })

  test('GET /paymentdata returns second page data', async () => {
    const { getPaymentData } = require('../../../../app/services/fuzzySearchService')
    const searchString = 'fa'
    const limit = 10
    const offset = 1
    const searchBy = null
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)
    const result = await getPaymentData(searchString, limit, offset, searchBy)
    expect(result.count).toEqual(11)
    expect(result.rows.length).toEqual(10)
  })

  test('GET /paymentdata returns sorted data', async () => {
    const { getPaymentData } = require('../../../../app/services/fuzzySearchService')
    const searchString = 'fa'
    const limit = 10
    const offset = 0
    const sortBy = null
    // Results without sorting
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)
    const result = await getPaymentData(searchString, limit, offset, sortBy)
    expect(result.rows[0].part_postcode).toEqual('PE15')

    // Results with sorting by score
    const result3 = await getPaymentData(searchString, limit, offset, 'score')
    expect(result3.rows[0].part_postcode).toEqual('PE15')

    // Results with sorting by payee_name
    const result4 = await getPaymentData(searchString, limit, offset, 'payee_name')
    expect(result4.rows[0].part_postcode).toEqual('LL15')

    // Results with sorting by town
    const result5 = await getPaymentData(searchString, limit, offset, 'town')
    expect(result5.rows[0].part_postcode).toEqual('CH65')

    // Results with sorting by part_postcode
    const result6 = await getPaymentData(searchString, limit, offset, 'part_postcode')
    expect(result6.rows[0].part_postcode).toEqual('CH65')

    // Results with sorting by county_council
    const result7 = await getPaymentData(searchString, limit, offset, 'county_council')
    expect(result7.rows[0].part_postcode).toEqual('PE15')
  })

  test('GET /paymentdata returns error  for invalid parameters', async () => {
    const searchString = ''
    const limit = 20
    const offset = 0
    const searchBy = null

    await expect(getPaymentData(searchString, limit, offset, searchBy))
      .rejects
      .toThrow('Empty search content')
  })

  test('GET /paymentdata parameter default valus used', async () => {
    const errorMessage = 'Empty search content'
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getPaymentData())
      .rejects
      .toThrow(errorMessage)
  })
})
