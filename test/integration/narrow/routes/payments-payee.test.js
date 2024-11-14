const databaseService = require('../../../../app/data/database')
const paymentDetailsDatabase = require('../../../data/payment-details-db-rows.json')
const expectedPaymentDetails = require('../../../data/payment-details-expected-data.json')

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

afterAll(() => {
  jest.resetAllMocks()
})

const paymentsDetailsUrl = '/v1/payments/Farmer Vel/WD6'

describe('/v1/payments/{payeeName}/{partPostcode} api call test', () => {
  const mockDb = jest.spyOn(databaseService, 'getPaymentDetails')
  mockDb.mockReturnValue(paymentDetailsDatabase)

  test('GET /v1/payments/{payeeName}/{partPostcode} returns 200', async () => {
    const options = {
      method: 'GET',
      url: paymentsDetailsUrl
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual(expectedPaymentDetails)
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} returns 404', async () => {
    mockDb.mockReturnValue(null)
    const options = {
      method: 'GET',
      url: paymentsDetailsUrl
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} returns 500', async () => {
    mockDb.mockImplementation(() => { throw new Error() })
    const options = {
      method: 'GET',
      url: paymentsDetailsUrl
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
