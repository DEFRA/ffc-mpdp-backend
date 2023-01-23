const paymentestdata = require('../app/paymentestdata.json')
const { PaymentDataModel } = require('../../../../app/services/databaseService')

describe('downloadall test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  // test to check that the response is a csv file
  test('GET /downloadall route returns csv file', async () => {
    const options = {
      method: 'GET',
      url: '/downloadall'
    }
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(paymentestdata)
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/csv')
    expect(response.headers['content-disposition']).toContain('attachment')
    expect(response.result).toContain('"payee_name","part_postcode","town","county_council","total_amount"')
    expect(response.result).toContain('"Erin Balistreri","CA15","Maryport","Cumbria","4064.00"')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
