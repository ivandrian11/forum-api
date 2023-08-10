const AddCommentUseCase = require('../AddCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'content of comment'
    }
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: payload.content,
      threadId: payload.threadId,
      owner: payload.owner,
      date: '2023-08-21T07:00:00.000Z'
    })

    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.verifyThreadIsExist = jest.fn().mockResolvedValue()
    mockCommentRepository.addComment = jest.fn().mockResolvedValue(
      new AddedComment({
        id: 'comment-123',
        content: payload.content,
        threadId: payload.threadId,
        owner: payload.owner,
        date: '2023-08-21T07:00:00.000Z'
      })
    )

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const addedComment = await addCommentUseCase.execute(payload)

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment)
    expect(mockThreadRepository.verifyThreadIsExist).toBeCalledWith(
      payload.threadId
    )
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(payload)
    )
  })
})
