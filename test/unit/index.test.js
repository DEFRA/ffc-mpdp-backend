jest.mock('../../app/insights')
const { setupAppInsights } = require('../../app/insights')

jest.mock('../../app/server')
const { createServer } = require('../../app/server')

const { startServer } = require('../../app')

const mockServer = {
  start: jest.fn()
}

describe('startServer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    createServer.mockResolvedValue(mockServer)
  })

  test('should setup application insights', async () => {
    await startServer()
    expect(setupAppInsights).toHaveBeenCalledTimes(1)
  })

  test('should create a new server instance', async () => {
    await startServer()
    expect(createServer).toHaveBeenCalledTimes(1)
  })

  test('should start the server', async () => {
    await startServer()
    expect(mockServer.start).toHaveBeenCalledTimes(1)
  })
})
