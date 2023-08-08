const LikeRepository = require('../../../Domains/likes/LikeRepository')
const LikeCommentUseCase = require('../LikeCommentUseCase')

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const mockLikeRepository = new LikeRepository()
    mockLikeRepository.verifyLikeIsExist = jest.fn().mockReturnValue()
    mockLikeRepository.addLike = jest.fn().mockResolvedValue()
    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository
    })

    // Action
    await likeCommentUseCase.execute(payload)

    // Assert
    expect(mockLikeRepository.verifyLikeIsExist).toBeCalledWith(
      payload.commentId,
      payload.owner
    )
    expect(mockLikeRepository.addLike).toBeCalledWith(payload)
  })
})
