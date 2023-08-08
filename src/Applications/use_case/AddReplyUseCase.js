const AddedReply = require('../../Domains/replies/entities/AddedReply')
const NewReply = require('../../Domains/replies/entities/NewReply')

class AddReplyUseCase {
  constructor ({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository
    this._commentRepository = commentRepository
  }

  async execute (payload) {
    const newReply = new NewReply(payload)
    await this._commentRepository.verifyCommentIsExist(
      payload.commentId,
      payload.threadId
    )
    const addedReply = await this._replyRepository.addReply(newReply)
    return new AddedReply(addedReply)
  }
}

module.exports = AddReplyUseCase
