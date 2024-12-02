describe('router plugin', () => {
  test('should log payloads if environment is not production', () => {
    config.get.mockReturnValue(false)
    const logging = require('../../../app/plugins/logging')
    expect(logging.options.logPayload).toBe(true)
  })
})
