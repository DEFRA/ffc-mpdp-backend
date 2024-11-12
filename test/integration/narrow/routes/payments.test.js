const { createServer } = require('../../../../app/server')
let server

beforeEach(async () => {
  server = await createServer()
  await server.initialize()
})

afterEach(async () => {
  await server.stop()
  jest.clearAllMocks()
})

describe('/v1/payments api call test', () => {
  jest.mock('../../../../app/services/fuzzy-search')
  const { getPaymentData } = require('../../../../app/services/fuzzy-search')

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

  test('/v1/payments api test to be defined', () => {
    const paymentData = require('../../../../app/routes/payments')
    expect(paymentData).toBeDefined()
    expect(paymentData.options.handler).toBeDefined()
  })

  test('POST /v1/payments returns 200', async () => {
    const options = {
      method: 'POST',
      url: '/v1/payments',
      payload: {
        searchString: '__search_string__',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /v1/payments calls the search function with the payload data', async () => {
    const options = {
      method: 'POST',
      url: '/v1/payments',
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

  test('POST /v1/payments returns 200 when no results found', async () => {
    getPaymentData.mockReturnValue({ count: 0, rows: [], filterOptions: { schemes: ['Sustainable Farming Incentive'], counties: [], amounts: [] } })
    const options = {
      method: 'POST',
      url: '/v1/payments',
      payload: {
        searchString: '__search_string__',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /v1/payments returns 500', async () => {
    getPaymentData.mockImplementation(() => { throw new Error() })
    const options = {
      method: 'POST',
      url: '/v1/payments',
      payload: {
        searchString: '__search_string__',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
