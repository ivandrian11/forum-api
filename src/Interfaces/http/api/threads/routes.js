const { jwtStrategyName } = require('../../../../Commons/config')

const routes = handler => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: jwtStrategyName
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadByIdHandler
  }
]

module.exports = routes
