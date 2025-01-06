jest.mock('../../../app/plugins/router')
const router = require('../../../app/plugins/router')

jest.mock('../../../app/plugins/logging')
const logging = require('../../../app/plugins/logging')

const mockServer = {
  register: jest.fn()
}

const { registerPlugins } = require('../../../app/plugins')

describe('registerPlugins', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should register logging plugin', async () => {
    await registerPlugins(mockServer)
    expect(mockServer.register).toHaveBeenCalledWith(expect.arrayContaining([logging]))
  })

  test('should register router plugin', async () => {
    await registerPlugins(mockServer)
    expect(mockServer.register).toHaveBeenCalledWith(expect.arrayContaining([router]))
  })
})
