const { getPaymentData, PaymentDataModel, getPaymentDetails, PaymentDetailModel } = require('../../../../app/services/databaseService')

afterAll(() => {
  jest.resetAllMocks()
})

describe('database-service PaymentData test', () => {
  test('database-service to be defined', () => {
    const getPaymentData = require('../../../../app/services/databaseService')
    expect(getPaymentData).toBeDefined()
  })

  test('database-service to be defined', () => {
    expect(PaymentDataModel).toBeDefined()
  })

  test('GET /paymentdata returns right data', async () => {
    const searchString = 'Farmer Vel'
    const limit = 20
    const offset = 0
    const mockData = {
      count: ['c1', 'c2', 'c3'],
      rows: ['r1', 'r2', 'r3']
    }
    const expectedData = {
      count: 3,
      rows: ['r1', 'r2', 'r3']
    }

    const mockDb = jest.spyOn(PaymentDataModel, 'findAndCountAll')
    mockDb.mockResolvedValue(mockData)
    const result = await getPaymentData(searchString, limit, offset)
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdata returns error  for invalid parameters', async () => {
    const searchString = ''
    const limit = 20
    const offset = 0
    await expect(getPaymentData(searchString, limit, offset))
      .rejects
      .toThrow('Empty search content')
  })

  test('GET /paymentdata returns DB error', async () => {
    const searchString = 'Farmer Vel'
    const limit = null
    const offset = null
    const errorMessage = 'DB Error'

    const mockDb = jest.spyOn(PaymentDataModel, 'findAndCountAll')
    mockDb.mockRejectedValue(new Error(errorMessage))

    await expect(getPaymentData(searchString, limit, offset))
      .rejects
      .toThrow(errorMessage)
  })

  test('GET /paymentdata parameter default valus used', async () => {
    const errorMessage = 'Empty search content'
    const mockDb = jest.spyOn(PaymentDataModel, 'findAndCountAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getPaymentData())
      .rejects
      .toThrow(errorMessage)
  })
})

describe('database-service paymentdetails test', () => {
  test('paymentdetails service and model to be defined', () => {
    expect(getPaymentDetails).toBeDefined()
    expect(PaymentDetailModel).toBeDefined()
  })

  test('GET /paymentdetails returns right data', async () => {
    const payeeName = 'Farmer Vel'
    const partPostcode = 'WT5'
    const mockData = {
      rows: ['r1', 'r2', 'r3']
    }
    const expectedData = {
      rows: ['r1', 'r2', 'r3']
    }
    const mockDb = jest.spyOn(PaymentDetailModel, 'findAll')
    mockDb.mockResolvedValue(mockData)
    const result = await getPaymentDetails(payeeName, partPostcode)
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdetails returns error  for empty parameters', async () => {
    const errorMessage = 'Empty payeeName or  partPostcode'
    await expect(getPaymentDetails())
      .rejects
      .toThrow(errorMessage)
  })

  test('GET /paymentdetails returns DB error', async () => {
    const payeeName = 'Farmer Vel'
    const partPostcode = 'WT5'
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(PaymentDetailModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getPaymentDetails(payeeName, partPostcode))
      .rejects
      .toThrow(errorMessage)
  })

  test('GET /paymentdetails returns DB error', async () => {
    const payeeName = 'Farmer Vel'
    const partPostcode = 'WT5'
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(PaymentDetailModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getPaymentDetails(payeeName, partPostcode))
      .rejects
      .toThrow(errorMessage)
  })
})
