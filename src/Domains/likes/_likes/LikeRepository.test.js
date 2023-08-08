const LikeRepository = require('../LikeRepository')

describe('LikeRepository repo interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository()

    // Action and Assert
    await expect(likeRepository.addLike({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )

    await expect(likeRepository.verifyLikeIsExist('')).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )

    await expect(likeRepository.deleteLikeById('')).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
