describe('Index test', () => {
  test('start the server from index', () => {
    const index = require('../../../../app/index')
    expect(index).toBeDefined()
  })
})
