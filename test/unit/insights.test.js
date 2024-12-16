jest.mock('applicationinsights', () => ({
  setup: jest.fn().mockReturnThis(),
  start: jest.fn(),
  defaultClient: {
    context: {
      keys: {},
      tags: {}
    }
  }
}))
const appInsights = require('applicationinsights')

const { setupAppInsights } = require('../../app/insights')

const consoleSpy = jest.spyOn(console, 'log')

describe('setupAppInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('does not setup application insights if no connection string present', () => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING
    setupAppInsights()
    expect(appInsights.setup).toHaveBeenCalledTimes(0)
  })

  test('logs that application insights is not running if no connection string present', () => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING
    setupAppInsights()
    expect(consoleSpy).toHaveBeenCalledWith('App Insights not running')
  })

  test('starts application insights if connection string present', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-connection-string'
    setupAppInsights()
    expect(appInsights.setup).toHaveBeenCalledTimes(1)
  })

  test('passes the connection string to applicationinsights package', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-connection-string'
    setupAppInsights()
    expect(appInsights.setup).toHaveBeenCalledWith('test-connection-string')
  })

  test('starts application insights if connection string present', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-connection-string'
    setupAppInsights()
    expect(appInsights.start).toHaveBeenCalledTimes(1)
  })

  test('sets the cloud role tag to the APPINSIGHTS_CLOUDROLE environment variable', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-connection-string'
    process.env.APPINSIGHTS_CLOUDROLE = 'test-cloud-role'
    setupAppInsights()
    expect(appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole]).toBe('test-cloud-role')
  })

  test('logs that application insights is running if connection string present', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-connection-string'
    setupAppInsights()
    expect(consoleSpy).toHaveBeenCalledWith('App Insights running')
  })
})
