const {
  getAllPaymentData,
  PaymentDataModel,
  getPaymentDetails,
  PaymentDetailModel,
  schemePaymentsModel,
  getSchemePaymentsByYear
} = require('../../../app/services/databaseService')

afterAll(() => {
  jest.resetAllMocks()
})

// Reset databaseService cache after each test
afterEach(() => {
  jest.resetModules()
})

describe('database-service PaymentData test', () => {
  test('getAllPaymentData & PaymentDataModel  to be defined', () => {
    expect(getAllPaymentData).toBeDefined()
    expect(PaymentDataModel).toBeDefined()
  })

  test('GET /paymentdata returns right data', async () => {
    const {
      getAllPaymentData,
      PaymentDataModel
    } = require('../../../app/services/databaseService')
    const mockData = {
      rows: ['r1', 'r2', 'r3']
    }
    const expectedData = {
      rows: ['r1', 'r2', 'r3']
    }

    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(mockData)
    const result = await getAllPaymentData()
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdata returns empty array when no data found', async () => {
    const {
      getAllPaymentData,
      PaymentDataModel
    } = require('../../../app/services/databaseService')
    const mockData = []
    const expectedData = []
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(mockData)

    const result = await getAllPaymentData()
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdata returns DB error', async () => {
    const {
      getAllPaymentData,
      PaymentDataModel
    } = require('../../../app/services/databaseService')
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))

    await expect(getAllPaymentData()).rejects.toThrow(errorMessage)
  })
})

// Test cases for /paymentdetails api
describe('database-service paymentdetails test', () => {
  test('paymentdetails service to be defined', () => {
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
    await expect(getPaymentDetails()).rejects.toThrow(errorMessage)
  })

  test('GET /paymentdetails returns DB error', async () => {
    const payeeName = 'Farmer Vel'
    const partPostcode = 'WT5'
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(PaymentDetailModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getPaymentDetails(payeeName, partPostcode)).rejects.toThrow(
      errorMessage
    )
  })
})

describe('database-service getSchemePaymentsByYear test', () => {
  test('getSchemePaymentsByYear service and model to be defined', () => {
    expect(getSchemePaymentsByYear).toBeDefined()
    expect(schemePaymentsModel).toBeDefined()
  })

  test('GET /schemePaymentsByYear returns right data', async () => {
    const mockData = {
      rows: [{ scheme: 'SFI', financial_year: '21/22', amount: '12000.00' }]
    }

    const mockDb = jest.spyOn(schemePaymentsModel, 'findAll')
    mockDb.mockResolvedValue(mockData)
    const result = await getSchemePaymentsByYear()
    expect(result).toEqual(mockData)
  })

  test('GET /schemePaymentsByYear returns DB error', async () => {
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(schemePaymentsModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getSchemePaymentsByYear()).rejects.toThrow(errorMessage)
  })
})
