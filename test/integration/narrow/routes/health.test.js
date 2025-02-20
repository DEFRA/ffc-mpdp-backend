jest.mock('../../../../app/data/database')
const { healthCheck } = require('../../../../app/data/database')

const { createServer } = require('../../../../app/server')
let server

describe('health routes', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
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

  test('GET /healthy should call database health check', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }
    await server.inject(options)
    expect(healthCheck).toHaveBeenCalled()
  })

  test('GET /healthy should return 500 if database health check fails', async () => {
    healthCheck.mockImplementation(() => {
      throw new Error('Database connection failed')
    })
    const options = {
      method: 'GET',
      url: '/healthy'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
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
