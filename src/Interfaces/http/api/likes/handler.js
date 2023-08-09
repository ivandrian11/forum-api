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

    const { commentId } = request.params
    const { id: credentialId } = request.auth.credentials

    await likeCommentUseCase.execute({
      commentId,
      owner: credentialId
    })

    const response = h.response({
      status: 'success'
    })
    response.code(201)
    return response
  }
}

module.exports = LikesHandler
