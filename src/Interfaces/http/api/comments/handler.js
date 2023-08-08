const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')
const autoBind = require('auto-bind')

class CommentsHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postCommentHandler ({ payload, params, auth }, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    )
    const addedComment = await addCommentUseCase.execute({
      content: payload.content,
      threadId: params.threadId,
      owner: auth.credentials.id
    })

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler ({ params, auth }) {
    const useCasePayload = {
      commentId: params.commentId,
      threadId: params.threadId,
      owner: auth.credentials.id
    }

    const deleteComment = this._container.getInstance(DeleteCommentUseCase.name)
    await deleteComment.execute(useCasePayload)

    return {
      status: 'success'
    }
  }
}

module.exports = CommentsHandler
