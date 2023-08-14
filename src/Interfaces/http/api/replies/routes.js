const { jwtStrategyName } = require('../../../../Commons/config')

const routes = handler => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: jwtStrategyName
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyByIdHandler,
    options: {
      auth: jwtStrategyName
    }
  }
]

module.exports = routes
