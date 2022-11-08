describe('paymentdata api test', () => {
  test('start the server from index', () => {
    const paymentdata = require('../../../../app/routes/paymentdata')
    expect(paymentdata).toBeDefined()
  })
})
