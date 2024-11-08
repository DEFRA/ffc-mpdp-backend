const databaseService = require('../../../../app/services/database')
const paymentsdetailsdbrow = require('../../../data/payment-details-db-rows.json')
const paymentdetailsexpecteddata = require('../../../data/payment-details-expected-data.json')

const createServer = require('../../../../app/server')
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

const paymentsDetailsUrl = '/paymentdetails?payeeName=Farmer Vel&partPostcode=WD6'

describe('paymentdetails api call test', () => {
  const mockDb = jest.spyOn(databaseService, 'getPaymentDetails')
  mockDb.mockReturnValue(paymentsdetailsdbrow)

  test('paymentdetails api test to be defined', () => {
    const paymentdetails = require('../../../../app/routes/payment-detail')
    expect(paymentdetails).toBeDefined()
    expect(paymentdetails[0].handler).toBeDefined()
  })

  test('GET /paymentdetails returns 200', async () => {
    const options = {
      method: 'GET',
      url: paymentsDetailsUrl
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual(paymentdetailsexpecteddata)
  })

  test('GET /paymentdetails returns 404', async () => {
    mockDb.mockReturnValue(null)
    const options = {
      method: 'GET',
      url: paymentsDetailsUrl
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /paymentdetails returns 500', async () => {
    mockDb.mockImplementation(() => { throw new Error() })
    const options = {
      method: 'GET',
      url: paymentsDetailsUrl
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
