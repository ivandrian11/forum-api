const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    }

    const mockCommentRepository = new CommentRepository()

    mockCommentRepository.verifyIsTheOwner = jest.fn().mockResolvedValue()
    mockCommentRepository.verifyCommentIsExist = jest.fn().mockResolvedValue()
    mockCommentRepository.deleteCommentById = jest.fn().mockResolvedValue()

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository
    })

    // Action
    await deleteCommentUseCase.execute(payload)

    // Assert
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(
      payload.commentId,
      payload.threadId
    )
    expect(mockCommentRepository.verifyIsTheOwner).toBeCalledWith(
      payload.commentId,
      payload.owner
    )
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      payload.commentId
    )
  })
})
