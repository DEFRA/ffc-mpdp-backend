const databaseService = require('../../../../../app/services/databaseService')
const paymentsdetailsdbrow = require('../../../../data/paymentsdetailsdbrows.json')
const paymentdetailsexpecteddata = require('../../../../data/paymentdetailsexpecteddata.json')

const createServer = require('../../../../../app/server')
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

const paymentsDetailsUrl = '/paymentdetails?payeeName=Farmer Vel&partPostcode=WD6'

describe('paymentdetails api call test', () => {
  const mockDb = jest.spyOn(databaseService, 'getPaymentDetails')
  mockDb.mockReturnValue(paymentsdetailsdbrow)

  test('paymentdetails api test to be defined', () => {
    const paymentdetails = require('../../../../../app/routes/paymentdetail')
    expect(paymentdetails).toBeDefined()
    expect(paymentdetails.handler).toBeDefined()
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
