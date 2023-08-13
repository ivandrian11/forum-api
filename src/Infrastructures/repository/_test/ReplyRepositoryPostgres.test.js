const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
    await CommentsTableTestHelper.addComment({ id: 'comment-123' })
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  // Arange
  const payload = {
    commentId: 'comment-123',
    threadId: 'thread-123',
    owner: 'user-123',
    content: 'content of reply'
  }
  const fakeIdGenerator = () => 'xyz'
  const replyRepositoryPostgres = new ReplyRepositoryPostgres(
    pool,
    fakeIdGenerator
  )

  describe('addReply function', () => {
    it('should persist new reply and return property correctly', async () => {
      // Action
      const addedReply = await replyRepositoryPostgres.addReply(payload)
      const replies = await RepliesTableTestHelper.getReplyById(addedReply.id)

      // Assert
      expect(replies).toHaveLength(1)
      expect(replies[0].comment_id).toBe(payload.commentId)
      expect(replies[0].owner).toBe(payload.owner)
      expect(replies[0].content).toBe(payload.content)
      expect(replies[0].is_deleted).toBeFalsy()
    })

    it('should return added reply correctly', async () => {
      // Action
      const addedReply = await replyRepositoryPostgres.addReply(payload)

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-xyz',
          owner: payload.owner,
          content: payload.content
        })
      )
    })
  })

  describe('verifyIsTheOwner function', () => {
    it('should return AuthorizationError when reply owner is not the same as the payload', async () => {
      // Action
      await RepliesTableTestHelper.addReply({ id: 'reply-xyz' })

      // Assert
      await expect(
        replyRepositoryPostgres.verifyIsTheOwner('reply-xyz', 'user-xyz')
      ).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw NotFoundError when reply owner is same', async () => {
      // Action
      await RepliesTableTestHelper.addReply({ id: 'reply-xyz' })

      // Assert
      await expect(
        replyRepositoryPostgres.verifyIsTheOwner('reply-xyz', payload.owner)
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyReplyIsExist function', () => {
    it('should throw NotFoundError when reply is not available', async () => {
      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyIsExist(
          'reply-xyz',
          payload.commentId,
          payload.threadId
        )
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when reply are available', async () => {
      // Action
      await RepliesTableTestHelper.addReply({ id: 'reply-xyz' })

      // Assert
      await expect(
        replyRepositoryPostgres.verifyReplyIsExist(
          'reply-xyz',
          payload.commentId,
          payload.threadId
        )
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when reply is not available', async () => {
      // Action & Assert
      await expect(
        replyRepositoryPostgres.deleteReplyById('reply-xyz')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should delete reply correctly', async () => {
      // Action
      await RepliesTableTestHelper.addReply({ id: 'reply-xyz' })
      await replyRepositoryPostgres.deleteReplyById('reply-xyz')
      const deletedReply = await RepliesTableTestHelper.getReplyById(
        'reply-xyz'
      )

      // Assert
      expect(deletedReply[0].is_deleted).toBeTruthy()
    })
  })

  describe('getRepliesByThreadId function', () => {
    it('should return all replies from a thread correctly', async () => {
      // Action
      await RepliesTableTestHelper.addReply({ id: 'reply-xyz' })
      await RepliesTableTestHelper.addReply({ id: 'reply-abc' })
      const output = await replyRepositoryPostgres.getRepliesByThreadId(
        'thread-123'
      )

      // Assert
      expect(output[0]).toHaveProperty('id')
      expect(output[0]).toHaveProperty('username')
      expect(output[0]).toHaveProperty('date')
      expect(output[0]).toHaveProperty('content')
      expect(output[0]).toHaveProperty('is_deleted')
      expect(output).toHaveLength(2)
    })

    it('should return an empty array when no replies exist for the thread', async () => {
      // Action
      const output = await replyRepositoryPostgres.getRepliesByThreadId(
        'thread-123'
      )

      // Assert
      expect(output).toStrictEqual([])
      expect(output).toHaveLength(0)
    })
  })
})
