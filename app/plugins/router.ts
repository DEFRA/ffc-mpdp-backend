import { Server } from "@hapi/hapi";

const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes)
    }
  }
}
