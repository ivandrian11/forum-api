const DeleteReplyUseCase = require('../DeleteReplyUseCase')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const payload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    }

    const mockReplyRepository = new ReplyRepository()

    mockReplyRepository.verifyReplyIsExist = jest.fn().mockResolvedValue()
    mockReplyRepository.verifyIsTheOwner = jest.fn().mockResolvedValue()
    mockReplyRepository.deleteReplyById = jest.fn().mockResolvedValue()

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository
    })

    // Action
    await deleteReplyUseCase.execute(payload)

    // Assert
    expect(mockReplyRepository.verifyReplyIsExist).toBeCalledWith(
      payload.replyId,
      payload.commentId,
      payload.threadId
    )
    expect(mockReplyRepository.verifyIsTheOwner).toBeCalledWith(
      payload.replyId,
      payload.owner
    )
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(payload.replyId)
  })
})
