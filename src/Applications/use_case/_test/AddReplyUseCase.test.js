const AddReplyUseCase = require('../AddReplyUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
      content: 'content of reply'
    }
    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: payload.content,
      commentId: payload.commentId,
      owner: payload.owner,
      date: '2023-08-21T07:00:00.000Z'
    })

    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    mockCommentRepository.verifyCommentIsExist = jest.fn().mockResolvedValue()
    mockReplyRepository.addReply = jest.fn().mockResolvedValue(mockAddedReply)

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const addedReply = await addReplyUseCase.execute(payload)

    // Assert
    expect(addedReply).toStrictEqual(mockAddedReply)
    expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith(
      payload.commentId,
      payload.threadId
    )
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(payload))
  })
})
