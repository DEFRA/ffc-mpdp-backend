jest.mock('../../../app/data/database')
const { getAnnualPayments } = require('../../../app/data/database')

const { getPaymentSummary } = require('../../../app/data/summary')

describe('summary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getAnnualPayments.mockResolvedValue([
      { financial_year: '20/21', scheme: 'scheme', total_amount: 100 },
      { financial_year: '21/22', scheme: 'scheme', total_amount: 200 },
      { financial_year: '21/22', scheme: 'scheme', total_amount: 300 }
    ])
  })

  describe('getPaymentSummary', () => {
    test('should return summary data as an object', async () => {
      const data = await getPaymentSummary()
      expect(data).toBeInstanceOf(Object)
    })
  })
})
