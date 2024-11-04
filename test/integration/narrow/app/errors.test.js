describe('errors plugin test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('errors plugin should be defined', () => {
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

  test('Verify the plugins are registered to the server', async () => {
    expect(server.registrations['hapi-pino']).toBeDefined()
    expect(server.registrations.errors).toBeDefined()
  }, 30000)
})
