describe('downloadall test', () => {
  const server = require('../../../../app/server')

  beforeEach(async () => {
    // TODO move this registration to server.js once the code base migrated to typescript
    await server.register(require('@hapi/inert'))
    await server.start()
  })

  test('GET /healthz route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/downloadall'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
