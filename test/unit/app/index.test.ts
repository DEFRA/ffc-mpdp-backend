describe('', () => {
    afterEach(() => {
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })
    
    test('StartServer gets called', () => {
        const mockStartServer = jest.fn()
        jest.mock('../../../app/server', () => ({
            startServer: mockStartServer
        }))

        require('../../../app/index')

        expect(mockStartServer).toHaveBeenCalled()
    })
})