import { Server } from '@hapi/hapi'
import { startServer } from '../../../../app/server'

describe('Healthy test', () => {
  let server: Server;
  beforeEach(async () => {
    server = await startServer()
  })

  test('GET /healthz route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthz'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
