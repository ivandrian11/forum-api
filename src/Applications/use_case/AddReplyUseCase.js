const AddedReply = require('../../Domains/replies/entities/AddedReply')
const NewReply = require('../../Domains/replies/entities/NewReply')

class AddReplyUseCase {
  constructor ({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    const newReply = new NewReply(useCasePayload)
    await this._commentRepository.verifyCommentIsExist(
      useCasePayload.commentId,
      useCasePayload.threadId
    )
    const addedReply = await this._replyRepository.addReply(newReply)
    return new AddedReply(addedReply)
  }
}

module.exports = AddReplyUseCase
