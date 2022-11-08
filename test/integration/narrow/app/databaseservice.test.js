describe('database-service test', () => {
  test('database-service to be defined', () => {
    const databaseservice = require('../../../../app/services/database-service')
    expect(databaseservice).toBeDefined()
  })
})
