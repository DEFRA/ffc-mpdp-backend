const service = require('../../../../app/services/fuzzy-search')
const getSearchSuggestionsMock = jest.spyOn(service, 'getSearchSuggestions')

const createServer = require('../../../../app/server')
let server

beforeEach(async () => {
  server = await createServer()
  await server.initialize()
})

afterEach(async () => {
  await server.stop()
  jest.clearAllMocks()
})

const url = '/searchsuggestion?searchString=__search_string__'
const options = { method: 'GET', url }
const mockdata = {
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

describe('paymentdata api call test', () => {
  test('searchsuggestion api to be defined', () => {
    const searchsuggestion = require('../../../../app/routes/payments-search')
    expect(searchsuggestion).toBeDefined()
    expect(searchsuggestion[0].options.handler).toBeDefined()
  })

  test('GET /searchsuggestion returns 200', async () => {
    getSearchSuggestionsMock.mockReturnValue(mockdata)
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /searchsuggestion calls the search function with the payload data', async () => {
    getSearchSuggestionsMock.mockReturnValue(mockdata)

    const searchString = '__search_string_%$£!&*__'
    const url = `/searchsuggestion?searchString=${encodeURIComponent(searchString)}`
    const options = { method: 'GET', url }
    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(getSearchSuggestionsMock).toHaveBeenCalledWith(searchString)
  })

  test('GET /searchsuggestion returns 404', async () => {
    const emptyResult = { count: 0, rows: [] }
    getSearchSuggestionsMock.mockReturnValue(emptyResult)
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /searchsuggestion returns 500', async () => {
    getSearchSuggestionsMock.mockImplementation(() => { throw new Error() })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})

describe('searchsuggestion api call test DB error', () => {
  test('GET /searchsuggestion error in DB', async () => {
    const { PaymentDataModel } = require('../../../../app/services/database')
    const mockDb = jest.spyOn(PaymentDataModel, 'findAndCountAll')
    mockDb.mockRejectedValue(new Error('DB Error'))
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
