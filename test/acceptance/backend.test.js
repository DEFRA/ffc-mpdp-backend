const fetch = require('node-fetch')
const z = require('zod')

const responseDataSchema = z.string({
  financial_year: z.string(),
  payee_name: z.string(),
  part_postcode: z.string().min(2).max(4), // Part postcodes like "LS7", "LS15"
  town: z.string(),
  county_council: z.string(),
  parliamentary_constituency: z.string(),
  scheme: z.string(),
  scheme_detail: z.string(),
  amount: z.string()
})

describe('MPDP backend acceptance tests', () => {
  const baseURL = 'http://ffc-mpdp-backend:3000'

  test('Verify csv file bulk download using the downloadall endpoint', async () => {
    jest.setTimeout(10000)
    const response = await fetch(`${baseURL}/downloadall`)
    const responseData = await response.text()
    expect(response.status).toBe(200)
    responseDataSchema.parse(responseData)
  })
})
