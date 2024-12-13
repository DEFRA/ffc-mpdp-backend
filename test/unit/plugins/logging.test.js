jest.mock('hapi-pino')

let config

describe('logging plugin', () => {
  beforeEach(() => {
    jest.resetModules()

    jest.mock('../../../app/config')
    config = require('../../../app/config')
  })

  test('should log payloads if environment is not production', () => {
    config.get.mockReturnValue(false)
    const logging = require('../../../app/plugins/logging')
    expect(logging.options.logPayload).toBe(true)
  })

  test('should not log payloads if environment is production', () => {
    config.get.mockReturnValue(true)
    const logging = require('../../../app/plugins/logging')
    expect(logging.options.logPayload).toBe(false)
  })
})
