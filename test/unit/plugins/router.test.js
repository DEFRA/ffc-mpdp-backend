jest.mock('../../../app/routes/health')
const health = require('../../../app/routes/health')

jest.mock('../../../app/routes/payments')
const payments = require('../../../app/routes/payments')

jest.mock('../../../app/routes/payments-payee')
const paymentsPayee = require('../../../app/routes/payments-payee')

jest.mock('../../../app/routes/payments-search')
const paymentsSearch = require('../../../app/routes/payments-search')

jest.mock('../../../app/routes/payments-summary')
const paymentsSummary = require('../../../app/routes/payments-summary')

const mockServer = {
  route: jest.fn()
}

const router = require('../../../app/plugins/router')

describe('router plugin', () => {
  test('should have a name', () => {
    expect(router.plugin.name).toBe('router')
  })

  test('should have a register function', () => {
    expect(router.plugin.register).toBeInstanceOf(Function)
  })

  test('should register routes', async () => {
    await router.plugin.register(mockServer)
    expect(mockServer.route).toHaveBeenCalledTimes(1)
  })

  test('should register health route', async () => {
    await router.plugin.register(mockServer)
    expect(mockServer.route).toHaveBeenCalledWith(expect.arrayContaining(health))
  })

  test('should register payments route', async () => {
    await router.plugin.register(mockServer)
    expect(mockServer.route).toHaveBeenCalledWith(expect.arrayContaining(payments))
  })

  test('should register payments-payee route', async () => {
    await router.plugin.register(mockServer)
    expect(mockServer.route).toHaveBeenCalledWith(expect.arrayContaining(paymentsPayee))
  })

  test('should register payments-search route', async () => {
    await router.plugin.register(mockServer)
    expect(mockServer.route).toHaveBeenCalledWith(expect.arrayContaining([paymentsSearch]))
  })

  test('should register payments-summary route', async () => {
    await router.plugin.register(mockServer)
    expect(mockServer.route).toHaveBeenCalledWith(expect.arrayContaining(paymentsSummary))
  })
})
