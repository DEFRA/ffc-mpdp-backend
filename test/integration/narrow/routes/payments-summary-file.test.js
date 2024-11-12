const csvPaymentsByYearSummaryTestData = require('./csv-payments-by-year-summary-test-data.json')
const { SchemePaymentsModel } = require('../../../../app/services/database')

describe('downloadPaymentsByYearSummary test', () => {
  const { createServer } = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  // Test to check that the response is a csv file
  test('GET /downloadPaymentsByYearSummary route returns csv file', async () => {
    const options = {
      method: 'GET',
      url: '/downloadPaymentsByYearSummary'
    }
    const mockDb = jest.spyOn(SchemePaymentsModel, 'findAll')
    mockDb.mockResolvedValue(csvPaymentsByYearSummaryTestData)
    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/csv')
    expect(response.headers['content-disposition']).toContain('attachment')
    expect(response.result).toContain('"financial year","scheme","amount"')
    expect(response.result).toContain('"21/22","Sustainable Farming Incentive Pilot","1436025.00"')
    expect(response.result).toContain('"21/22","Farming Equipment and Technology Fund","1125893.00"')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
