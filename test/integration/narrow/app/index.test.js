describe('Index test', () => {
  const createServer = require('../../../../app/server')
  let server

  afterEach(async () => {
    server = await createServer()
    console.log(server)
    await server.stop()
    console.log(server)
    console.log('stopped the server----->')
  })

  test('start the server from index', () => {
    const index = require('../../../../app/index')
    expect(index).toBeDefined()
  })
})
