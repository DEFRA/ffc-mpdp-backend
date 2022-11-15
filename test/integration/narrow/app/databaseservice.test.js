
describe('database-service test', () => {
  test('database-service to be defined', () => {
    const getPaymentData = require('../../../../app/services/databaseService')
    expect(getPaymentData).toBeDefined()
  })
})
