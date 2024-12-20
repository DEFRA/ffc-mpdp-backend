const { createServer } = require('../../../../app/server')
let server

describe('health routes', () => {
  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /healthy should return 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /healthy should return "ok" response', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('ok')
  })

  test('GET /healthz should return 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthz'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /healthz should return "ok" response', async () => {
    const options = {
      method: 'GET',
      url: '/healthz'
    }
    const response = await server.inject(options)
    expect(response.payload).toBe('ok')
  })
})
