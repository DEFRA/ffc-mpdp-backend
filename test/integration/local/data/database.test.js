jest.mock('@azure/identity')

jest.mock('../../../../app/cache')
const { get, set } = require('../../../../app/cache')

const {
  SchemePaymentsModel,
  PaymentDataModel,
  PaymentDetailModel,
  getAnnualPayments,
  getPayeePayments,
  getAllPayments,
  getAllPaymentsByPage
} = require('../../../../app/data/database')

describe('database', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await PaymentDetailModel.truncate()
    await PaymentDetailModel.bulkCreate([
      { id: 1, payee_name: 'payee name 1', part_postcode: 'pp1', town: 'town', county_council: 'county council', financial_year: '20/21', parliamentary_constituency: 'parliamentary constituency', scheme: 'scheme 1', scheme_detail: 'scheme detail 1', amount: 100 },
      { id: 2, payee_name: 'payee name 1', part_postcode: 'pp1', town: 'town', county_council: 'county council', financial_year: '20/21', parliamentary_constituency: 'parliamentary constituency', scheme: 'scheme 1', scheme_detail: 'scheme detail 1', amount: 100 },
      { id: 3, payee_name: 'payee name 1', part_postcode: 'pp1', town: 'town', county_council: 'county council', financial_year: '20/21', parliamentary_constituency: 'parliamentary constituency', scheme: 'scheme 2', scheme_detail: 'scheme detail 1', amount: 100 },
      { id: 4, payee_name: 'payee name 2', part_postcode: 'pp2', town: 'town', county_council: 'county council', financial_year: '20/21', parliamentary_constituency: 'parliamentary constituency', scheme: 'scheme 1', scheme_detail: 'scheme detail 1', amount: 100 }
    ])
  })

  describe('SchemePaymentsModel', () => {
    test('should return a sequelize model for aggregate_scheme_payments table', () => {
      expect(SchemePaymentsModel).toBeInstanceOf(Function)
      expect(SchemePaymentsModel.name).toBe('aggregate_scheme_payments')
    })

    test('should include id, financial_year, scheme and total_amount fields', () => {
      const fields = Object.keys(SchemePaymentsModel.tableAttributes)
      expect(fields).toEqual(['id', 'financial_year', 'scheme', 'total_amount'])
    })
  })

  describe('PaymentDataModel', () => {
    test('should return a sequelize model for payment_activity_data table', () => {
      expect(PaymentDataModel).toBeInstanceOf(Function)
      expect(PaymentDataModel.name).toBe('payment_activity_data')
    })

    test('should include id, payee_name, part_postcode, town, county_council and amount fields', () => {
      const fields = Object.keys(PaymentDataModel.tableAttributes)
      expect(fields).toEqual(['id', 'payee_name', 'part_postcode', 'town', 'county_council', 'amount'])
    })
  })

  describe('PaymentDetailModel', () => {
    test('should return a sequelize model for payment_activity_data table', () => {
      expect(PaymentDetailModel).toBeInstanceOf(Function)
      expect(PaymentDetailModel.name).toBe('payment_activity_data')
    })

    test('should include id, payee_name, part_postcode, town, county_council, financial_year, parliamentary_constituency, scheme, scheme_detail and amount fields', () => {
      const fields = Object.keys(PaymentDetailModel.tableAttributes)
      expect(fields).toEqual(['id', 'payee_name', 'part_postcode', 'town', 'county_council', 'financial_year', 'parliamentary_constituency', 'scheme', 'scheme_detail', 'amount'])
    })
  })

  describe('getAnnualPayments', () => {
    beforeEach(async () => {
      await SchemePaymentsModel.truncate()
      await SchemePaymentsModel.bulkCreate([
        { id: 1, scheme: 'scheme 1', financial_year: '20/21', total_amount: 100 },
        { id: 2, scheme: 'scheme 2', financial_year: '20/21', total_amount: 200 }
      ])
    })

    test('should return all annual payments', async () => {
      const data = await getAnnualPayments()
      expect(data).toEqual([
        { scheme: 'scheme 1', financial_year: '20/21', total_amount: '100.00' },
        { scheme: 'scheme 2', financial_year: '20/21', total_amount: '200.00' }
      ])
    })

    test('should not include id field', async () => {
      const data = await getAnnualPayments()
      expect(data.every(x => !x.id)).toBe(true)
    })
  })

  describe('getPayeePayments', () => {
    test('should return all matching provided payee', async () => {
      const data = await getPayeePayments('payee name 1', 'pp1')
      expect(data).toHaveLength(2)
    })

    test('should group by scheme', async () => {
      const data = await getPayeePayments('payee name 1', 'pp1')
      expect(data[0].scheme).toBe('scheme 1')
      expect(data[1].scheme).toBe('scheme 2')
    })

    test('should sum total amount for payee and scheme and return as amount', async () => {
      const data = await getPayeePayments('payee name 1', 'pp1')
      expect(data[0].amount).toBe('200.00')
    })
  })

  describe('getAllPayments', () => {
    test('should try to get cached payments', async () => {
      await getAllPayments()
      expect(get).toHaveBeenCalledWith('payments')
    })

    test('should return cached payments if cached payments exist', async () => {
      get.mockResolvedValueOnce(['cached payments'])
      const data = await getAllPayments()
      expect(data).toEqual(['cached payments'])
    })

    test('should get all payments from database if cached payments are not an array', async () => {
      get.mockResolvedValueOnce('not an array')
      jest.spyOn(PaymentDataModel, 'findAll')
      await getAllPayments()
      expect(PaymentDataModel.findAll).toHaveBeenCalledTimes(1)
    })

    test('should get all payments from database if cached payments is empty array', async () => {
      get.mockResolvedValueOnce([])
      jest.spyOn(PaymentDataModel, 'findAll')
      await getAllPayments()
      expect(PaymentDataModel.findAll).toHaveBeenCalledTimes(1)
    })

    test('should get all payments from database if no cached payments', async () => {
      jest.spyOn(PaymentDataModel, 'findAll')
      await getAllPayments()
      expect(PaymentDataModel.findAll).toHaveBeenCalledTimes(1)
    })

    test('should cache payments after querying from database', async () => {
      await getAllPayments()
      expect(set).toHaveBeenCalledWith('payments', expect.any(Array))
    })

    test('should not cache payments if no payments returned', async () => {
      jest.spyOn(PaymentDataModel, 'findAll').mockResolvedValueOnce([])
      await getAllPayments()
      expect(set).not.toHaveBeenCalled()
    })

    test('should not cache payments if payments returned is not an array', async () => {
      jest.spyOn(PaymentDataModel, 'findAll').mockResolvedValueOnce('not an array')
      await getAllPayments()
      expect(set).not.toHaveBeenCalled()
    })

    test('should not cache payments if already in cache', async () => {
      get.mockResolvedValueOnce(['cached payments'])
      await getAllPayments()
      expect(set).not.toHaveBeenCalled()
    })

    test('should group payments by payee and scheme', async () => {
      const data = await getAllPayments()
      expect(data).toHaveLength(3)
    })

    test('should sum total amount for payee and scheme and return as total_amount', async () => {
      const data = await getAllPayments()
      expect(data.find(x => x.payee_name === 'payee name 1' && x.scheme === 'scheme 1').total_amount).toBe('200.00')
      expect(data.find(x => x.payee_name === 'payee name 1' && x.scheme === 'scheme 2').total_amount).toBe('100.00')
      expect(data.find(x => x.payee_name === 'payee name 2' && x.scheme === 'scheme 1').total_amount).toBe('100.00')
    })

    test('should return payee_name, part_postcode, town, county_council, scheme, financial_year and total_amount fields', async () => {
      const data = await getAllPayments()
      expect(Object.keys(data[0])).toEqual(['payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year', 'total_amount'])
    })
  })

  describe('getAllPaymentsByPage', () => {
    test('should return all payments by page', async () => {
      const data = await getAllPaymentsByPage(1, 2)
      expect(data).toHaveLength(2)
    })

    test('should sum total amount for payee and scheme and return as total_amount', async () => {
      const data = await getAllPaymentsByPage(1, 2)
      expect(data.find(x => x.payee_name === 'payee name 1' && x.scheme === 'scheme 1').total_amount).toBe('200.00')
      expect(data.find(x => x.payee_name === 'payee name 1' && x.scheme === 'scheme 2').total_amount).toBe('100.00')
    })

    test('should return payee_name, part_postcode, town, county_council, scheme, financial_year, scheme_detail and total_amount fields', async () => {
      const data = await getAllPaymentsByPage(1, 2)
      expect(Object.keys(data[0])).toEqual(['payee_name', 'part_postcode', 'town', 'county_council', 'scheme', 'financial_year', 'scheme_detail', 'total_amount'])
    })

    test('should return requested page', async () => {
      const data = await getAllPaymentsByPage(2, 2)
      expect(data).toHaveLength(1)
      expect(data[0].payee_name).toBe('payee name 2')
    })

    test('should limit to page size', async () => {
      const data = await getAllPaymentsByPage(1, 2)
      expect(data).toHaveLength(2)
    })

    test('should return page one if no page is provided', async () => {
      const data = await getAllPaymentsByPage()
      expect(data).toHaveLength(3)
      expect(data[0].payee_name).toBe('payee name 1')
    })

    test('should order by payee_name', async () => {
      await PaymentDataModel.create({ id: 5, payee_name: 'payee name 0', part_postcode: 'pp3', town: 'town', county_council: 'county council', financial_year: '20/21', scheme: 'scheme 1', scheme_detail: 'scheme detail 1', amount: 100 })
      const data = await getAllPaymentsByPage()
      expect(data[0].payee_name).toBe('payee name 0')
    })
  })
})
