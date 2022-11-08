process.env.NODE_ENV = 'development'

describe('application config  test', () => {
  test('app-config to be defined', () => {
    const appconfig = require('../../../../app/config/appConfig')
    expect(appconfig).toBeDefined()
  })
  test('app-config env should be defined', () => {
    const appconfig = require('../../../../app/config/appConfig')
    expect(appconfig.env).toBeDefined()
  })

  test('app-config to be development mode', () => {
    const appconfig = require('../../../../app/config/appConfig')
    expect(appconfig.isDev === true)
  })
})
