jest.mock('../../../../app/services/database')
const { getSchemePaymentsByYear } = require('../../../../app/services/database')

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

const options = { method: 'GET', url: '/schemePayments' }
const mockData = [
  { scheme: 'SFI', financial_year: '21/22', amount: '12000.00' },
  { scheme: 'SFI', financial_year: '22/23', amount: '24000.00' },
  { scheme: 'FETF', financial_year: '21/22', amount: '5000.00' },
  { scheme: 'FETF', financial_year: '22/23', amount: '10000.00' }
]

const expectedData = {
  '21/22': [
    { scheme: 'SFI', financial_year: '21/22', amount: '12000.00' },
    { scheme: 'FETF', financial_year: '21/22', amount: '5000.00' }
  ],
  '22/23': [
    { scheme: 'SFI', financial_year: '22/23', amount: '24000.00' },
    { scheme: 'FETF', financial_year: '22/23', amount: '10000.00' }
  ]
}

describe('schemepayments api call test', () => {
  test('schemepayments api test to be defined', () => {
    const schemePayments = require('../../../../app/routes/payments-summary')
    expect(schemePayments).toBeDefined()
    expect(schemePayments[0].handler).toBeDefined()
  })

  test('GET /schemepayments returns status 200 and results formatted by financial_year', async () => {
    getSchemePaymentsByYear.mockResolvedValue(mockData)
    const response = await server.inject(options)
    expect(getSchemePaymentsByYear).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual(expectedData)
  })

  test('GET /schemepayments returns 500 when an error is thrown', async () => {
    getSchemePaymentsByYear.mockImplementation(() => {
      throw new Error()
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
