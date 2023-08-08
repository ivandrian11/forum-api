class DeleteReplyUseCase {
  constructor ({ replyRepository }) {
    this._replyRepository = replyRepository
  }

  async execute (useCasePayload) {
    const { replyId, commentId, threadId, owner } = useCasePayload

    await this._replyRepository.verifyReplyIsExist(replyId, commentId, threadId)
    await this._replyRepository.verifyIsTheOwner(replyId, owner)
    await this._replyRepository.deleteReplyById(replyId)
  }
}

module.exports = DeleteReplyUseCase
