const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase')
const autoBind = require('auto-bind')

class LikesHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async likeCommentHandler (request, h) {
    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name
    )

    const { threadId, commentId } = request.params
    const { id: credentialId } = request.auth.credentials

    await likeCommentUseCase.execute({
      threadId,
      commentId,
      owner: credentialId
    })

    const response = h.response({
      status: 'success'
    })
    return response
  }
}

module.exports = LikesHandler
