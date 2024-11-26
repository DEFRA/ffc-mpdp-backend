jest.mock('../../app/insights')
jest.mock('../../app/server')
const { createServer } = require('../../app/server')
const { startServer } = require('../../app')

const mockServer = {
  start: jest.fn(),
  info: {
    uri: 'http://0.0.0.0:3000'
  }
}

describe('startServer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    createServer.mockResolvedValue(mockServer)
  })

  test('should create a new server instance', async () => {
    await startServer()
    expect(createServer).toHaveBeenCalledTimes(1)
  })

  test('should start the server', async () => {
    await startServer()
    expect(mockServer.start).toHaveBeenCalledTimes(1)
  })

  test('should log the server URI', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    await startServer()
    expect(consoleSpy).toHaveBeenCalledWith(`Server running at: ${mockServer.info.uri}`)
  })
})
