const NewLike = require('../../Domains/likes/entites/NewLike')

class LikeCommentUseCase {
  constructor ({ likeRepository, commentRepository }) {
    this._likeRepository = likeRepository
    this._commentRepository = commentRepository
  }

  async execute (payload) {
    const newLike = new NewLike(payload)
    await this._commentRepository.verifyCommentIsExist(
      newLike.commentId,
      payload.threadId
    )
    const data = await this._likeRepository.verifyLikeIsExist(
      newLike.commentId,
      newLike.owner
    )
    if (data) {
      await this._likeRepository.deleteLike(newLike.commentId, newLike.owner)
    } else {
      await this._likeRepository.addLike(newLike)
    }
  }
}

module.exports = LikeCommentUseCase
