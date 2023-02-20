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
  const service = require('../../../../app/services/fuzzySearchService')
  const getPaymentDataMock = jest.spyOn(service, 'getPaymentData')

  beforeEach(() => {
    getPaymentDataMock.mockReturnValue({
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
          schemes: ['__DUMMY_SCHEME__']
        }
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getPaymentDataMock).toHaveBeenCalledWith(options.payload)
  })

  test('POST /paymentdata returns 404', async () => {
    getPaymentDataMock.mockReturnValue({ count: 0, rows: [] })
    const options = {
      method: 'POST',
      url: '/paymentdata',
      payload: {
        searchString: '__search_string__',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('POST /paymentdata returns 500', async () => {
    getPaymentDataMock.mockImplementation(() => { throw new Error() })
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

describe('paymentdata api test mocking DB service', () => {
  test('POST /paymentdata error in DB', async () => {
    const { PaymentDataModel } = require('../../../../app/services/databaseService')

    const mockDb = jest.spyOn(PaymentDataModel, 'findAndCountAll')
    mockDb.mockRejectedValue(new Error('DB Error'))

    const options = {
      method: 'POST',
      url: '/paymentdata',
      payload: {
        searchString: 'Farmer Vel',
        limit: 10
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
