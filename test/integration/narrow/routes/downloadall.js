describe('downloadall test', () => {
  const server = require('../../../../app/server')

  beforeAll(async () => {
    await server().start()
  })

  test('GET /healthz route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/downloadall'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(304)
  })

  afterEach(async () => {
    await server.stop()
  })
})
