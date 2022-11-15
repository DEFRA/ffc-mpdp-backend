module.exports = {
  plugin: {
    name: 'errors',
    register: (server) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          // Log the error
          request.log('error', {
            statusCode,
            message: response.message,
            payloadMessage: response.data ? response.data.payload.message : ''
          })
          return response
        }
        return h.continue
      })
    }
  }
}
