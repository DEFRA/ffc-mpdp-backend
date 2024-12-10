jest.mock('../../../../app/data/summary')
const { getPaymentSummary, getPaymentSummaryCsv } = require('../../../../app/data/summary')

getPaymentSummary.mockResolvedValue('payments summary')
getPaymentSummaryCsv.mockResolvedValue('payments,summary,csv')

const { createServer } = require('../../../../app/server')
let server

describe('payments-summary routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /v1/payments/summary should return 200', async () => {
    const options = {
      method: 'GET',
      url: '/v1/payments/summary'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /v1/payments/summary should return payments summary', async () => {
    const options = {
      method: 'GET',
      url: '/v1/payments/summary'
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('payments summary')
  })

  test('GET /v1/payments/summary/file should return 200', async () => {
    const options = {
      method: 'GET',
      url: '/v1/payments/summary/file'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /v1/payments/summary/file should return payments summary csv', async () => {
    const options = {
      method: 'GET',
      url: '/v1/payments/summary/file'
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('payments,summary,csv')
  })

  test('GET /v1/payments/summary/file should return csv file', async () => {
    const options = {
      method: 'GET',
      url: '/v1/payments/summary/file'
    }
    const response = await server.inject(options)
    expect(response.headers['content-type']).toBe('text/csv; charset=utf-8')
  })

  test('GET /v1/payments/summary/file should return csv file attachment', async () => {
    const options = {
      method: 'GET',
      url: '/v1/payments/summary/file'
    }
    const response = await server.inject(options)
    expect(response.headers['content-disposition']).toBe('attachment;filename=ffc-payments-by-year.csv')
  })
})
