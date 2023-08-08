const AddedComment = require('../../Domains/comments/entities/AddedComment')
const NewComment = require('../../Domains/comments/entities/NewComment')

class AddCommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute (payload) {
    const newComment = new NewComment(payload)
    await this._threadRepository.verifyThreadIsExist(newComment.threadId)
    const addedComment = await this._commentRepository.addComment(newComment)
    return new AddedComment(addedComment)
  }
}

module.exports = AddCommentUseCase
