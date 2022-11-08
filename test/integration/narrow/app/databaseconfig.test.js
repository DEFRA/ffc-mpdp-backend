describe('database-config test', () => {
  test('database-config to be defined', () => {
    const databaseconfig = require('../../../../app/config/database-config')
    expect(databaseconfig).toBeDefined()
  })
})
