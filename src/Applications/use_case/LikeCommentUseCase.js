const NewLike = require('../../Domains/likes/entites/NewLike')

class LikeCommentUseCase {
  constructor ({ likeRepository }) {
    this._likeRepository = likeRepository
  }

  async execute (payload) {
    const newLike = new NewLike(payload)
    const data = await this._likeRepository.verifyLikeIsExist(
      payload.commentId,
      payload.owner
    )
    if (data) {
      await this._likeRepository.deleteLikeById(data.id)
    } else {
      await this._likeRepository.addLike(newLike)
    }
  }
}

module.exports = LikeCommentUseCase
