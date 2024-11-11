const csvpaymentestdata = require('./csv-payment-test-data.json')
const { PaymentDetailModel } = require('../../../../app/services/database')

describe('downloaddetails test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    const mockDb = jest.spyOn(PaymentDetailModel, 'findAll')
    mockDb.mockResolvedValue(csvpaymentestdata)
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  test('GET /downloaddetails route returns csv file', async () => {
    const options = {
      method: 'GET',
      url: '/downloaddetails?payeeName=Stacy Schneider&partPostcode=TN39'
    }
    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/csv')
    expect(response.headers['content-disposition']).toContain('attachment')
    expect(response.result).toContain('"financial_year","payee_name","part_postcode","town","county_council","parliamentary_constituency","scheme","scheme_detail","amount"')
    expect(response.result).toContain('"21/22","Stacy Schneider","TN39","Bexhill-on-Sea","East Sussex","Bexhill and Battle","Farming Equipment and Technology Fund","Livestock Handling and weighing equipment",4210')
    expect(response.result).toContain('"21/22","Stacy Schneider","TN39","Bexhill-on-Sea","East Sussex","Bexhill and Battle","Sustainable Farming Incentive Pilot","Arable and Horticultural Land",3492')
  })

  test('GET /downloaddetails route returns 400 when parameters missing', async () => {
    const options = {
      method: 'GET',
      url: '/downloaddetails?payeeName=Stacy Schneider'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)

    const option2 = {
      method: 'GET',
      url: '/downloaddetails'
    }
    const response2 = await server.inject(option2)
    expect(response2.statusCode).toBe(400)
  })
})
