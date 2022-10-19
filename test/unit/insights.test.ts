describe('Application Insights', () => {
  const appInsights = require('applicationinsights')
  jest.mock('applicationinsights')

  const startMock = jest.fn()
  const setupMock = jest.fn(() => {
    return {
      start: startMock
    }
  })
  appInsights.setup = setupMock
  const cloudRoleTag = 'cloudRoleTag'
  const tags = {}
  appInsights.defaultClient = {
    context: {
      keys: {
        cloudRole: cloudRoleTag
      },
      tags
    }
  }

  const consoleLogSpy = jest.spyOn(console, 'log')

  const appInsightsConnectionString = process.env.APPINSIGHTS_INSTRUMENTATIONKEY

  beforeEach(() => {
    delete process.env.APPINSIGHTS_INSTRUMENTATIONKEY
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env.APPINSIGHTS_INSTRUMENTATIONKEY = appInsightsConnectionString
  })

  test('is started when env var exists', () => {
    const appName = 'test-app'
    process.env.APPINSIGHTS_CLOUDROLE = appName
    process.env.APPINSIGHTS_INSTRUMENTATIONKEY = 'something'
    const insights = require('../../app/insights')

    insights.setupInsights()

    expect(setupMock).toHaveBeenCalledTimes(1)
    expect(startMock).toHaveBeenCalledTimes(1)
    // expect(tags[cloudRoleTag]).toEqual(appName)
    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith('App Insights Running')
  })

  test('logs not running when env var does not exist', () => {
    const insights = require('../../app/insights')

    insights.setupInsights()

    expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    expect(consoleLogSpy).toHaveBeenCalledWith('App Insights Not Running!')
  })
})
