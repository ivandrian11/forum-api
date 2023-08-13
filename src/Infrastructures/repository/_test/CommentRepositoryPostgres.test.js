const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  // Arange
  const payload = {
    threadId: 'thread-123',
    owner: 'user-123',
    content: 'content of comment'
  }
  const fakeIdGenerator = () => 'xyz'
  const commentRepositoryPostgres = new CommentRepositoryPostgres(
    pool,
    fakeIdGenerator
  )

  describe('addComment function', () => {
    it('should persist new comment and return property correctly', async () => {
      // Action
      const addedComment = await commentRepositoryPostgres.addComment(payload)
      const comments = await CommentsTableTestHelper.getCommentById(
        addedComment.id
      )

      // Assert
      expect(comments).toHaveLength(1)
      expect(comments[0].thread_id).toBe(payload.threadId)
      expect(comments[0].owner).toBe(payload.owner)
      expect(comments[0].content).toBe(payload.content)
      expect(comments[0].is_deleted).toBeFalsy()
    })

    it('should return added comment correctly', async () => {
      // Action
      const addedComment = await commentRepositoryPostgres.addComment(payload)

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-xyz',
          content: payload.content,
          owner: payload.owner
        })
      )
    })
  })

  describe('verifyIsTheOwner function', () => {
    it('should return AuthorizationError when comment owner is not the same as the payload', async () => {
      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-xyz' })

      // Assert
      await expect(
        commentRepositoryPostgres.verifyIsTheOwner('comment-xyz', 'user-xyz')
      ).rejects.toThrowError(AuthorizationError)
    })

    it('should not return AuthorizationError when comment owner is same', async () => {
      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-xyz' })

      // Assert
      await expect(
        commentRepositoryPostgres.verifyIsTheOwner('comment-xyz', payload.owner)
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentIsExist function', () => {
    it('should throw NotFoundError when comment is not available', async () => {
      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentIsExist(
          'comment-xyz',
          payload.threadId
        )
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread and comment are available', async () => {
      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-xyz' })

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentIsExist(
          'comment-xyz',
          payload.threadId
        )
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment is not available', async () => {
      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteCommentById('comment-xyz')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should delete comment correctly', async () => {
      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-xyz' })
      await commentRepositoryPostgres.deleteCommentById('comment-xyz')
      const deletedComment = await CommentsTableTestHelper.getCommentById(
        'comment-xyz'
      )

      // Assert
      expect(deletedComment[0].is_deleted).toBeTruthy()
    })
  })

  describe('getCommentByThreadId function', () => {
    it('should return all comments from a thread correctly', async () => {
      // Action
      await CommentsTableTestHelper.addComment({ id: 'comment-xyz' })
      await CommentsTableTestHelper.addComment({ id: 'comment-abc' })
      const output = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      )

      // Assert
      expect(output[0]).toHaveProperty('id')
      expect(output[0]).toHaveProperty('content')
      expect(output[0]).toHaveProperty('date')
      expect(output[0]).toHaveProperty('username')
      expect(output[0]).toHaveProperty('is_deleted')
      expect(output).toHaveLength(2)
    })

    it('should return an empty array when no comments exist for the thread', async () => {
      // Action
      const output = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      )

      // Assert
      expect(output).toStrictEqual([])
      expect(output).toHaveLength(0)
    })
  })
})
