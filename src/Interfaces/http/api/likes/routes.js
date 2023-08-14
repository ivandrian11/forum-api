const { jwtStrategyName } = require('../../../../Commons/config')

const routes = handler => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.likeCommentHandler,
    options: {
      auth: jwtStrategyName
    }
  }
]

module.exports = routes
