const {
  getAllPayments,
  PaymentDataModel,
  getPayeePayments,
  PaymentDetailModel,
  SchemePaymentsModel,
  getAnnualPayments
} = require('../../../app/data/database')

jest.mock('../../../app/cache')
const { get } = require('../../../app/cache')

beforeAll(() => {
  get.mockResolvedValue({})
})

afterAll(() => {
  jest.resetAllMocks()
})

// Reset databaseService cache after each test
afterEach(() => {
  jest.resetModules()
})

describe('database-service PaymentData test', () => {
  test('getAllPayments & PaymentDataModel  to be defined', () => {
    expect(getAllPayments).toBeDefined()
    expect(PaymentDataModel).toBeDefined()
  })

  test('GET /paymentdata returns right data', async () => {
    const {
      getAllPayments,
      PaymentDataModel
    } = require('../../../app/data/database')
    const mockData = {
      rows: ['r1', 'r2', 'r3']
    }
    const expectedData = {
      rows: ['r1', 'r2', 'r3']
    }

    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(mockData)
    const result = await getAllPayments()
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdata returns empty array when no data found', async () => {
    const {
      getAllPayments,
      PaymentDataModel
    } = require('../../../app/data/database')
    const mockData = []
    const expectedData = []
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockResolvedValue(mockData)

    const result = await getAllPayments()
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdata returns DB error', async () => {
    const {
      getAllPayments,
      PaymentDataModel
    } = require('../../../app/data/database')
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(PaymentDataModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))

    await expect(getAllPayments()).rejects.toThrow(errorMessage)
  })
})

// Test cases for /paymentdetails api
describe('database-service paymentdetails test', () => {
  test('paymentdetails service to be defined', () => {
    expect(getPayeePayments).toBeDefined()
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
    const result = await getPayeePayments(payeeName, partPostcode)
    expect(result).toEqual(expectedData)
  })

  test('GET /paymentdetails returns DB error', async () => {
    const payeeName = 'Farmer Vel'
    const partPostcode = 'WT5'
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(PaymentDetailModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getPayeePayments(payeeName, partPostcode)).rejects.toThrow(
      errorMessage
    )
  })
})

describe('database-service getAnnualPayments test', () => {
  test('getAnnualPayments service and model to be defined', () => {
    expect(getAnnualPayments).toBeDefined()
    expect(SchemePaymentsModel).toBeDefined()
  })

  test('GET /schemePaymentsByYear returns right data', async () => {
    const mockData = {
      rows: [{ scheme: 'SFI', financial_year: '21/22', amount: '12000.00' }]
    }

    const mockDb = jest.spyOn(SchemePaymentsModel, 'findAll')
    mockDb.mockResolvedValue(mockData)
    const result = await getAnnualPayments()
    expect(result).toEqual(mockData)
  })

  test('GET /schemePaymentsByYear returns DB error', async () => {
    const errorMessage = 'DB Error'
    const mockDb = jest.spyOn(SchemePaymentsModel, 'findAll')
    mockDb.mockRejectedValue(new Error(errorMessage))
    await expect(getAnnualPayments()).rejects.toThrow(errorMessage)
  })
})
