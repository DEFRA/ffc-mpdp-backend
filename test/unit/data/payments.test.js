const { Readable } = require('stream')

jest.mock('../../../app/data/database')
const { getAllPaymentsByPage } = require('../../../app/data/database')

jest.mock('../../../app/data/search')
const { getPaymentData } = require('../../../app/data/search')

const { getPaymentsCsv, getAllPaymentsCsvStream } = require('../../../app/data/payments')

describe('payments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPaymentsCsv', () => {
    beforeEach(() => {
      getPaymentData.mockResolvedValue({
        rows: [{
          payee_name: 'payee name',
          part_postcode: 'part postcode',
          town: 'town',
          county_council: 'county council',
          total_amount: '100'
        }, {
          payee_name: 'payee name',
          part_postcode: 'part postcode',
          town: 'town',
          county_council: 'county council',
          total_amount: '200.00'
        }]
      })
    })

    test('should return headers', async () => {
      const data = await getPaymentsCsv({})
      expect(data).toContain('"payee_name","part_postcode","town","county_council","amount"')
    })

    test('should return data as csv', async () => {
      const data = await getPaymentsCsv({})
      expect(data).toContain('"payee name","part postcode","town","county council","100.00"')
      expect(data).toContain('"payee name","part postcode","town","county council","200.00"')
    })

    test('should format amount when value has no decimal', async () => {
      const data = await getPaymentsCsv({})
      expect(data).toContain('"payee name","part postcode","town","county council","100.00"')
    })

    test('should format amount when value has decimal', async () => {
      const data = await getPaymentsCsv({})
      expect(data).toContain('"payee name","part postcode","town","county council","200.00"')
    })

    test('should format amount when value is zero', async () => {
      getPaymentData.mockResolvedValue({
        rows: [{
          payee_name: 'payee name',
          part_postcode: 'part postcode',
          town: 'town',
          county_council: 'county council',
          total_amount: '0'
        }]
      })
      const data = await getPaymentsCsv({})
      expect(data).toContain('"payee name","part postcode","town","county council","0.00"')
    })

    test('should format amount as zero when value is null', async () => {
      getPaymentData.mockResolvedValue({
        rows: [{
          payee_name: 'payee name',
          part_postcode: 'part postcode',
          town: 'town',
          county_council: 'county council',
          total_amount: null
        }]
      })
      const data = await getPaymentsCsv({})
      expect(data).toContain('"payee name","part postcode","town","county council","0.00"')
    })

    test('should format amount as zero when value is undefined', async () => {
      getPaymentData.mockResolvedValue({
        rows: [{
          payee_name: 'payee name',
          part_postcode: 'part postcode',
          town: 'town',
          county_council: 'county council'
        }]
      })
      const data = await getPaymentsCsv({})
      expect(data).toContain('"payee name","part postcode","town","county council","0.00"')
    })
  })

  describe('getAllPaymentsCsvStream', () => {
    beforeEach(() => {
      getAllPaymentsByPage.mockResolvedValueOnce([
        {
          financial_year: '21/22',
          payee_name: 'payee name',
          part_postcode: 'part postcode',
          town: 'town',
          county_council: 'county council',
          parliamentary_constituency: 'parliamentary constituency',
          scheme: 'scheme',
          scheme_detail: 'scheme detail',
          total_amount: 100
        },
        {
          financial_year: '21/22',
          payee_name: 'payee name',
          part_postcode: 'part postcode',
          town: 'town',
          county_council: 'county council',
          parliamentary_constituency: 'parliamentary constituency',
          scheme: 'scheme',
          scheme_detail: 'scheme detail',
          total_amount: 200
        }
      ])
      getAllPaymentsByPage.mockResolvedValue([])
    })

    test('should return stream', async () => {
      const stream = getAllPaymentsCsvStream()
      expect(stream).toBeInstanceOf(Readable)
    })

    test('should return headers', async () => {
      const stream = getAllPaymentsCsvStream()
      const data = await new Promise((resolve, reject) => {
        let csv = ''
        stream.on('data', chunk => { csv += chunk })
        stream.on('end', () => resolve(csv))
        stream.on('error', reject)
      })
      expect(data).toContain('"financial_year","payee_name","part_postcode","town","county_council","parliamentary_constituency","scheme","scheme_detail","amount"')
    })

    test('should return data as csv', async () => {
      const stream = getAllPaymentsCsvStream()
      const data = await new Promise((resolve, reject) => {
        let csv = ''
        stream.on('data', chunk => { csv += chunk })
        stream.on('end', () => resolve(csv))
        stream.on('error', reject)
      })
      expect(data).toContain('"21/22","payee name","part postcode","town","county council","parliamentary constituency","scheme","scheme detail",100')
      expect(data).toContain('"21/22","payee name","part postcode","town","county council","parliamentary constituency","scheme","scheme detail",200')
    })
  })
})
