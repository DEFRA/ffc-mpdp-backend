describe('application config  test', () => {
  test('app-config to be defined', () => {
    const appconfig = require('../../../../app/config/app-config')
    expect(appconfig).toBeDefined()
  })
})
