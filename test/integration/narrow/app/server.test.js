describe('Server test', () => {
  test('createServer returns server', () => {
    const { createServer } = require('../../../../app/server')
    expect(createServer).toBeDefined()
  })
})
