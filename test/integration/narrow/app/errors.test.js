jest.mock(console)

describe('Server test', () => {
  test('createServer returns server', () => {
    const errors = require('../../../../app/plugins/errors')
    expect(errors).toBeDefined()
  })

  test('returns the error when the server called with error URL', async () => {
    const createServer = require('../../../../app/server')
    const server = await createServer()
    await server.start()

    const { error } = server.plugins.error
    return server.inject({
      url: '/error'
    }).then((response) => {
      expect(response.statusCode).toBe(500)
      expect(response.result.error).toBe(error)
    })
  })

  test('returns the error when the server called with error URL', async () => {
    const createServer = require('../../../../app/server')
    const server = await createServer()
    await server.start()
    expect(server.registrations['hapi-plugin']).to.exist()
  })

  test('console.log the text "hello"', async () => {
    const createServer = require('../../../../app/server')
    const server = await createServer()
    await server.start()
    // console.log = jest.fn()

    const options = {
      method: 'GET',
      url: '/paymentdata'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)

    // The first argument of the first call to the function was 'hello'
    expect(console.log).toHaveBeenCalledWith('Error while reading data')
  })
})
