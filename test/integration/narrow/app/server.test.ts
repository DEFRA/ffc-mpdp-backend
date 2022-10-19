import { startServer } from '../../../../app/server'

describe('Server test', () => {
  const currentPort = process.env.PORT
  const currentEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.port = currentPort
    process.env.NODE_ENV = currentEnv
  })

  test('Server gets created', async () => {
    console.log = jest.fn()

    process.env.NODE_ENV = 'test'
    const server = await startServer()

    expect(server.settings.port).toEqual(3000)
    expect(console.log).toHaveBeenCalledTimes(0)

    server.stop()
    jest.resetAllMocks()
  })

  test('Server uses env variables', async () => {
    console.log = jest.fn()

    process.env.PORT = '3001'
    process.env.NODE_ENV = 'development'

    const server = await startServer()
    expect(server.settings.port).toEqual(3001)
    expect(console.log).toHaveBeenCalledTimes(1)

    await server.stop()
    
  })
})
