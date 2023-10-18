const createServer = require('../../../../app/server')
let server

beforeEach(async () => {
  server = await createServer()
  await server.start()
})

afterEach(async () => {
  await server.stop()
  jest.clearAllMocks()
})

describe('paymentdata api call test', () => {
  jest.mock('../../../../app/services/fuzzySearchService')
  const { getPaymentData } = require('../../../../app/services/fuzzySearchService')

  // const getPaymentDataMock = jest.spyOn(service, 'getPaymentData')

  beforeEach(() => {
    getPaymentData.mockReturnValue({
      count: 1,
      rows: [{
        id: 1,
        payee_name: 'Farmer A',
        part_postcode: 'RG1',
        town: 'Reading',
        parliamentary_constituency: 'Reading East',
        county_council: 'Berkshire',
        scheme: 'SFI Arable and Horticultural Land',
        activity_detail: 'Low',
        amount: '223.65'
      }]
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('paymentdata api test to be defined', () => {
    const paymentdata = require('../../../../app/routes/paymentdata')
    expect(paymentdata).toBeDefined()
    expect(paymentdata.options.handler).toBeDefined()
  })

  test('POST /paymentdata returns 200', async () => {
    const options = {
      method: 'POST',
      url: '/paymentdata',
      payload: {
        searchString: '__search_string__',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /paymentdata calls the search function with the payload data', async () => {
    const options = {
      method: 'POST',
      url: '/paymentdata',
      payload: {
        searchString: '__SEARCH_STRING__',
        limit: 10,
        offset: 10,
        sortBy: '__SORT_BY__',
        filterBy: {
          schemes: ['__DUMMY_SCHEME__'],
          counties: ['__DUMMY_COUNTY__'],
          amounts: ['0-4999']
        }
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getPaymentData).toHaveBeenCalledWith(options.payload)
  })

  test('POST /paymentdata returns 200 when no results found', async () => {
    getPaymentData.mockReturnValue({ count: 0, rows: [], filterOptions: { schemes: ['Sustainable Farming Incentive'], counties: [], amounts: [] } })
    const options = {
      method: 'POST',
      url: '/paymentdata',
      payload: {
        searchString: '__search_string__',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /paymentdata returns 500', async () => {
    getPaymentData.mockImplementation(() => { throw new Error() })
    const options = {
      method: 'POST',
      url: '/paymentdata',
      payload: {
        searchString: '__search_string__',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
