const fuzzySearchService = require('../../../../app/services/fuzzy-search')
const getSearchSuggestionsMock = jest.spyOn(fuzzySearchService, 'getSearchSuggestions')

const { createServer } = require('../../../../app/server')
let server

beforeEach(async () => {
  server = await createServer()
  await server.initialize()
})

afterEach(async () => {
  await server.stop()
  jest.clearAllMocks()
})

const url = '/v1/payments/search?searchString=__search_string__'
const options = { method: 'GET', url }
const mockData = {
  count: 1,
  rows: [
    {
      payee_name: 'Louann Cummings',
      part_postcode: 'N17',
      town: 'Haringey, unparished area',
      county_council: 'None',
      total_amount: '14967.00',
      scheme: 'Farming Equipment and Technology Fund'
    }
  ]
}

describe('/v1/payments/search api call test', () => {
  test('/v1/payments/search api to be defined', () => {
    const searchSuggestion = require('../../../../app/routes/payments-search')
    expect(searchSuggestion).toBeDefined()
    expect(searchSuggestion.options.handler).toBeDefined()
  })

  test('GET /v1/payments/search returns 200', async () => {
    getSearchSuggestionsMock.mockReturnValue(mockData)
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /v1/payments/search calls the search function with the payload data', async () => {
    getSearchSuggestionsMock.mockReturnValue(mockData)

    const searchString = '__search_string_%$£!&*__'
    const url = `/v1/payments/search?searchString=${encodeURIComponent(searchString)}`
    const options = { method: 'GET', url }
    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(getSearchSuggestionsMock).toHaveBeenCalledWith(searchString)
  })

  test('GET /v1/payments/search returns 404', async () => {
    const emptyResult = { count: 0, rows: [] }
    getSearchSuggestionsMock.mockReturnValue(emptyResult)
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /v1/payments/search returns 500', async () => {
    getSearchSuggestionsMock.mockImplementation(() => { throw new Error() })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})

describe('/v1/payments/search api call test DB error', () => {
  test('GET /v1/payments/search error in DB', async () => {
    const { PaymentDataModel } = require('../../../../app/services/database')
    const mockDb = jest.spyOn(PaymentDataModel, 'findAndCountAll')
    mockDb.mockRejectedValue(new Error('DB Error'))
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
