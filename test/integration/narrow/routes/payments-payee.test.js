jest.mock('../../../../app/data/payee')
const { getPayeeDetails, getPayeeDetailsCsv } = require('../../../../app/data/payee')

getPayeeDetails.mockResolvedValue('payee details')
getPayeeDetailsCsv.mockResolvedValue('payee,details,csv')

const payeeName = 'payeeName'
const partPostcode = 'partPostcode'

const { createServer } = require('../../../../app/server')
let server

describe('payments-payee routes', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} should return 200', async () => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}`
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} should return payee details', async () => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}`
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('payee details')
  })

  test('GET /v1/payments/{payeeName}/{partPostcode}/file should return 200', async () => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}/file`
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test.each([' payeeName', 'payeeName '], 'GET /v1/payments/{payeeName}/{partPostcode} should trim payeeName', async (payeeNameWithSpace) => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeNameWithSpace}/${partPostcode}`
    }
    await server.inject(options)
    expect(getPayeeDetails).toHaveBeenCalledWith(payeeName)
  })

  test.each([' partPostcode', 'partPostcode '], 'GET /v1/payments/{payeeName}/{partPostcode} should trim partPostcode', async (partPostcodeWithSpace) => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcodeWithSpace}`
    }
    await server.inject(options)
    expect(getPayeeDetails).toHaveBeenCalledWith(partPostcode)
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} should return 404 if payee details undefined', async () => {
    getPayeeDetails.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}`
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} should return 404 if payee details null', async () => {
    getPayeeDetails.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}`
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} should return "Payee not found" if payee details undefined', async () => {
    getPayeeDetails.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}`
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('Payee not found')
  })

  test('GET /v1/payments/{payeeName}/{partPostcode} should return "Payee not found" if payee details null', async () => {
    getPayeeDetails.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}`
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('Payee not found')
  })

  test('GET /v1/payments/{payeeName}/{partPostcode}/file should return payments summary csv', async () => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}/file`
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('payee,details,csv')
  })

  test('GET /v1/payments/{payeeName}/{partPostcode}/file should return csv file', async () => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}/file`
    }
    const response = await server.inject(options)
    expect(response.headers['content-type']).toBe('text/csv; charset=utf-8')
  })

  test('GET /v1/payments/{payeeName}/{partPostcode}/file should return csv file attachment', async () => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcode}/file`
    }
    const response = await server.inject(options)
    expect(response.headers['content-disposition']).toBe('attachment;filename=ffc-payment-details.csv')
  })

  test.each([' payeeName', 'payeeName '], 'GET /v1/payments/{payeeName}/{partPostcode}/file should trim payeeName', async (payeeNameWithSpace) => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeNameWithSpace}/${partPostcode}/file`
    }
    await server.inject(options)
    expect(getPayeeDetailsCsv).toHaveBeenCalledWith(payeeName)
  })

  test.each([' partPostcode', 'partPostcode '], 'GET /v1/payments/{payeeName}/{partPostcode}/file should trim partPostcode', async (partPostcodeWithSpace) => {
    const options = {
      method: 'GET',
      url: `/v1/payments/${payeeName}/${partPostcodeWithSpace}/file`
    }
    await server.inject(options)
    expect(getPayeeDetailsCsv).toHaveBeenCalledWith(partPostcode)
  })
})
