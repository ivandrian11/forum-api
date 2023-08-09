const NewLike = require('../../Domains/likes/entites/NewLike')

class LikeCommentUseCase {
  constructor ({ likeRepository }) {
    this._likeRepository = likeRepository
  }

  async execute (payload) {
    const newLike = new NewLike(payload)
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
