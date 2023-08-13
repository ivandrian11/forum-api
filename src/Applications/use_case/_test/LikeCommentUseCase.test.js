const CommentRepository = require('../../../Domains/comments/CommentRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const LikeCommentUseCase = require('../LikeCommentUseCase')

describe('LikeCommentUseCase', () => {
  // Arrange
  const payload = {
    commentId: 'comment-123',
    owner: 'user-123'
  }

  const mockLikeRepository = new LikeRepository()
  const mockCommentRepository = new CommentRepository()
  mockCommentRepository.verifyCommentIsExist = jest.fn().mockResolvedValue()

  const likeCommentUseCase = new LikeCommentUseCase({
    likeRepository: mockLikeRepository,
    commentRepository: mockCommentRepository
  })

  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    mockLikeRepository.verifyLikeIsExist = jest.fn().mockReturnValue(0)
    mockLikeRepository.addLike = jest.fn().mockResolvedValue('likes-123')

    // Action
    await likeCommentUseCase.execute(payload)

    // Assert
    expect(mockLikeRepository.verifyLikeIsExist).toBeCalledWith(
      payload.commentId,
      payload.owner
    )
    expect(mockLikeRepository.addLike).toBeCalledWith(payload)
  })

  it('should orchestrating the unlike comment action correctly', async () => {
    // Arrange
    mockLikeRepository.verifyLikeIsExist = jest.fn().mockReturnValue(1)
    mockLikeRepository.deleteLike = jest.fn().mockResolvedValue()

    // Action
    await likeCommentUseCase.execute(payload)

    // Assert
    expect(mockLikeRepository.verifyLikeIsExist).toBeCalledWith(
      payload.commentId,
      payload.owner
    )
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
      payload.commentId,
      payload.owner
    )
  })
})
