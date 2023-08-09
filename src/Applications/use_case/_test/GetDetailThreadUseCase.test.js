const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')

describe('GetThreadUseCase', () => {
  it('should orchestrating get detail thread action correctly', async () => {
    // Arrange
    const payload = {
      threadId: 'thread-123'
    }

    const outputThread = {
      id: 'thread-123',
      title: 'title of thread',
      body: 'body of thread',
      username: 'user-123',
      date: '2023-08-21T07:00:00.000Z'
    }

    const outputComment = [
      {
        id: 'comment-123',
        username: 'user-234',
        content: 'content of comment',
        date: '2023-08-22T07:00:00.000Z'
      }
    ]

    const outputReply = [
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        username: 'user-123',
        date: '2023-08-23T07:00:00.000Z',
        content: 'content of reply'
      }
    ]

    const outputLike = 0

    const expectedOutput = [
      {
        ...outputComment[0],
        likeCount: outputLike,
        replies: outputReply.map(({ comment_id, ...props }) => props)
      }
    ]

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()
    const mockLikeRepository = new LikeRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockResolvedValue(outputThread)
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(outputComment)
    mockReplyRepository.getRepliesByThreadId = jest
      .fn()
      .mockResolvedValue(outputReply)
    mockLikeRepository.getLikesByThreadId = jest.fn().mockResolvedValue([])

    const mockDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository
    })

    // Action
    const detailThread = await mockDetailThreadUseCase.execute(payload.threadId)

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(payload.threadId)
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      payload.threadId
    )
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      payload.threadId
    )
    expect(mockLikeRepository.getLikesByThreadId).toBeCalledWith(
      payload.threadId
    )
    expect(detailThread).toStrictEqual({
      ...outputThread,
      comments: expectedOutput
    })
  })
})
