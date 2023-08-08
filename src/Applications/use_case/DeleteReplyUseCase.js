class DeleteReplyUseCase {
  constructor ({ replyRepository }) {
    this._replyRepository = replyRepository
  }

  async execute (payload) {
    const { replyId, commentId, threadId, owner } = payload

    await this._replyRepository.verifyReplyIsExist(replyId, commentId, threadId)
    await this._replyRepository.verifyIsTheOwner(replyId, owner)
    await this._replyRepository.deleteReplyById(replyId)
  }
}

module.exports = DeleteReplyUseCase
