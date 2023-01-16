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

afterAll(() => {
  jest.resetAllMocks()
})

describe('paymentdata api call test', () => {
  const service = require('../../../../app/services/fuzzySearchService')
  const getPaymentDataMock = jest.spyOn(service, 'getPaymentData')
  getPaymentDataMock.mockReturnValue({ count: 1, rows: [{ id: 1, payee_name: 'Farmer A', part_postcode: 'RG1', town: 'Reading', parliamentary_constituency: 'Reading East', county_council: 'Berkshire', scheme: 'SFI Arable and Horticultural Land', activity_detail: 'Low', amount: '223.65' }] })

  test('paymentdata api test to be defined', () => {
    const paymentdata = require('../../../../app/routes/paymentdata')
    expect(paymentdata).toBeDefined()
    expect(paymentdata.handler).toBeDefined()
  })

  test('GET /paymentdata returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/paymentdata'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /paymentdata returns 404', async () => {
    getPaymentDataMock.mockReturnValue({ count: 0, rows: [] })
    const options = {
      method: 'GET',
      url: '/paymentdata'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /paymentdata returns 500', async () => {
    getPaymentDataMock.mockImplementation(() => { throw new Error() })
    const options = {
      method: 'GET',
      url: '/paymentdata'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})

describe('paymentdata api test mocking DB service', () => {
  test('GET /paymentdata error in DB', async () => {
    const { PaymentDataModel } = require('../../../../app/services/databaseService')
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(PaymentDataModel, 'findAndCountAll')
    mockDb.mockRejectedValue(new Error(errorMessage))

    const options = {
      method: 'GET',
      url: '/paymentdata?searchString="Farmer Vel"'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
