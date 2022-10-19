import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";

module.exports = {
  method: 'GET',
  path: '/healthy',
  handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
    return h.response('ok').code(200)
  }
}
