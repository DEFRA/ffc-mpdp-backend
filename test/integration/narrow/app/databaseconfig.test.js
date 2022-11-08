describe('database-config test', () => {
  test('database-config to be defined', () => {
    const databaseconfig = require('../../../../app/config/databaseConfig')
    expect(databaseconfig).toBeDefined()
  })
})
