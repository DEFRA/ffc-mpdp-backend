describe('errors plugin test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('createServer returns server', () => {
    const errors = require('../../../../app/plugins/errors')
    expect(errors).toBeDefined()
  })

  test('test the invalid URL for 404 status', async () => {
    const options = {
      method: 'GET',
      url: '/invalidurl'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  }, 30000)

  test('returns the error when the server called with error URL', async () => {
    expect(server.registrations['hapi-pino']).toBeDefined()
    expect(server.registrations.errors).toBeDefined()
  }, 30000)
})
