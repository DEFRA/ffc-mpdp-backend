const csvpaymentestdata = require('./csvpaymentestdata.json')
const { PaymentDetailModel } = require('../../../../app/services/databaseService')

describe('downloadall test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  // Test to check that the response is a csv file
  test('GET /downloadall route returns csv file', async () => {
    const options = {
      method: 'GET',
      url: '/downloadall'
    }
    const mockDb = jest.spyOn(PaymentDetailModel, 'findAll')
    mockDb.mockResolvedValue(csvpaymentestdata)
    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/csv')
    expect(response.headers['content-disposition']).toContain('attachment')
    expect(response.result).toContain('"financial_year","payee_name","part_postcode","town","county_council","parliamentary_constituency","scheme","scheme_detail","amount"')
    expect(response.result).toContain('"21/22","Stacy Schneider","TN39","Bexhill-on-Sea","East Sussex","Bexhill and Battle","Farming Equipment and Technology Fund","Livestock Handling and weighing equipment",4210')
    expect(response.result).toContain('"21/22","Stacy Schneider","TN39","Bexhill-on-Sea","East Sussex","Bexhill and Battle","Sustainable Farming Incentive Pilot","Arable and Horticultural Land",3492')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
