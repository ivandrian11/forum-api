class DeleteCommentUseCase {
  constructor ({ commentRepository }) {
    this._commentRepository = commentRepository
  }

  async execute (payload) {
    const { commentId, threadId, owner } = payload
    await this._commentRepository.verifyCommentIsExist(commentId, threadId)
    await this._commentRepository.verifyIsTheOwner(commentId, owner)
    await this._commentRepository.deleteCommentById(commentId)
  }
}

module.exports = DeleteCommentUseCase
