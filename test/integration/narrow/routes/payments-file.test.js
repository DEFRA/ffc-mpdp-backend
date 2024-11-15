jest.mock('../../../../app/data/database')
const paymentData = require('../../../data/payment-details-db-rows.json')
const database = require('../../../../app/data/database')
const { createServer } = require('../../../../app/server')

describe('/v1/payments/file test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  // Test to check that the response is a csv file
  test('GET /v1/payments/file route returns csv file', async () => {
    const options = {
      method: 'GET',
      url: '/v1/payments/file'
    }
    const mockDb = jest.spyOn(database, 'getAllPayments')
    mockDb.mockResolvedValue(paymentData)
    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/csv')
    expect(response.headers['content-disposition']).toContain('attachment')
    expect(response.result).toContain('"financial_year","payee_name","part_postcode","town","county_council","parliamentary_constituency","scheme","scheme_detail","amount"')
    expect(response.result).toContain('"21/22","Farmer Vel","WD6","Elstree and Borehamwood","Hertfordshire","Hertsmere","Farming Equipment and Technology Fund","","11965.00"')
    expect(response.result).toContain('"21/22","Farmer Vel","WD6","Elstree and Borehamwood","Hertfordshire","Hertsmere","Sustainable Farming Incentive Pilot","Improved Grassland soils","31109.00"')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
