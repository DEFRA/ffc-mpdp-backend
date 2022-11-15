describe('errors plugin test', () => {
  test('createServer returns server', () => {
    const errors = require('../../../../app/plugins/errors')
    expect(errors).toBeDefined()
  })

  test('test the invalid URL for 500 status', async () => {
    const createServer = require('../../../../app/server')
    const server = await createServer()
    await server.start()
    const options = {
      method: 'GET',
      url: '/paymentdata'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  },30000)

  test('returns the error when the server called with error URL', async () => {
    const createServer = require('../../../../app/server')
    const server = await createServer()
    await server.start()
    console.log('server.registrations : ')
    console.log(server.registrations)

    expect(server.registrations['hapi-pino']).toBeDefined()
    expect(server.registrations.errors).toBeDefined()
  },30000)
})
