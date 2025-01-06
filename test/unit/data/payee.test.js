jest.mock('../../../app/data/database')
const { getPayeePayments } = require('../../../app/data/database')

const { getPayeeDetails, getPayeeDetailsCsv } = require('../../../app/data/payee')

describe('payee', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getPayeePayments.mockResolvedValue([{
      payee_name: 'payee name',
      part_postcode: 'part postcode',
      town: 'town',
      county_council: 'county council',
      parliamentary_constituency: 'parliamentary constituency',
      scheme: 'scheme 1',
      scheme_detail: 'scheme detail 1',
      activity_level: 'activity level 1',
      amount: 100,
      financial_year: '21/22'
    }, {
      payee_name: 'payee name',
      part_postcode: 'part postcode',
      town: 'town',
      county_council: 'county council',
      parliamentary_constituency: 'parliamentary constituency',
      scheme: 'scheme 2',
      scheme_detail: 'scheme detail 2',
      activity_level: 'activity level 2',
      amount: 200,
      financial_year: '21/22'
    }])
  })

  describe('getPayeeDetails', () => {
    test('should return payee details as an object', async () => {
      const data = await getPayeeDetails('payee name', 'part postcode')
      expect(data).toBeInstanceOf(Object)
    })

    test('should return payee details', async () => {
      const data = await getPayeeDetails('payee name', 'part postcode')
      expect(data).toEqual(expect.objectContaining({
        payee_name: 'payee name',
        part_postcode: 'part postcode',
        town: 'town',
        county_council: 'county council',
        parliamentary_constituency: 'parliamentary constituency'
      }))
    })

    test('should return schemes', async () => {
      const data = await getPayeeDetails('payee name', 'part postcode')
      expect(data.schemes).toEqual([
        {
          name: 'scheme 1',
          detail: 'scheme detail 1',
          activity_level: 'activity level 1',
          amount: 100,
          financial_year: '21/22'
        },
        {
          name: 'scheme 2',
          detail: 'scheme detail 2',
          activity_level: 'activity level 2',
          amount: 200,
          financial_year: '21/22'
        }
      ])
    })
  })

  describe('getPayeeDetailsCsv', () => {
    test('should return headers', async () => {
      const data = await getPayeeDetailsCsv('payee name', 'part postcode')
      expect(data).toContain('"financial_year","payee_name","part_postcode","town","county_council","parliamentary_constituency","scheme","scheme_detail","amount"')
    })

    test('should return data as csv', async () => {
      const data = await getPayeeDetailsCsv('payee name', 'part postcode')
      expect(data).toContain('"21/22","payee name","part postcode","town","county council","parliamentary constituency","scheme 1","scheme detail 1",100')
      expect(data).toContain('"21/22","payee name","part postcode","town","county council","parliamentary constituency","scheme 2","scheme detail 2",200')
    })

    test('should handle comma in scheme name', async () => {
      getPayeePayments.mockResolvedValue([{
        payee_name: 'payee name',
        part_postcode: 'part postcode',
        town: 'town',
        county_council: 'county council',
        parliamentary_constituency: 'parliamentary constituency',
        scheme: 'scheme, with comma',
        scheme_detail: 'scheme detail',
        amount: 100,
        financial_year: '21/22'
      }])
      const data = await getPayeeDetailsCsv('payee name', 'part postcode')
      expect(data).toContain('"21/22","payee name","part postcode","town","county council","parliamentary constituency","scheme, with comma","scheme detail",100')
    })

    test('should handle double quotes in scheme name', async () => {
      getPayeePayments.mockResolvedValue([{
        payee_name: 'payee name',
        part_postcode: 'part postcode',
        town: 'town',
        county_council: 'county council',
        parliamentary_constituency: 'parliamentary constituency',
        scheme: 'scheme "with" quotes',
        scheme_detail: 'scheme detail',
        amount: 100,
        financial_year: '21/22'
      }])
      const data = await getPayeeDetailsCsv('payee name', 'part postcode')
      expect(data).toContain('"21/22","payee name","part postcode","town","county council","parliamentary constituency","scheme ""with"" quotes","scheme detail",100')
    })

    test('should return headers only if no data', async () => {
      getPayeePayments.mockResolvedValue([])
      const data = await getPayeeDetailsCsv('payee name', 'part postcode')
      expect(data).toBe('"financial_year","payee_name","part_postcode","town","county_council","parliamentary_constituency","scheme","scheme_detail","amount"')
    })
  })
})
