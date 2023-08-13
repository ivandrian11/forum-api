const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
    await CommentsTableTestHelper.addComment({ id: 'comment-123' })
  })

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await pool.end()
  })

  // Arange
  const payload = {
    commentId: 'comment-123',
    owner: 'user-123'
  }
  const fakeIdGenerator = () => 'xyz'
  const likeRepositoryPostgres = new LikeRepositoryPostgres(
    pool,
    fakeIdGenerator
  )

  describe('addLike function', () => {
    it('should persist new like and return added like correctly', async () => {
      // Action
      const id = await likeRepositoryPostgres.addLike(payload)
      const likes = await LikesTableTestHelper.getLikeById(id)

      // Assert
      expect(likes).toHaveLength(1)
      expect(likes[0].comment_id).toBe(payload.commentId)
      expect(likes[0].owner).toBe(payload.owner)
    })

    describe('verifyLikeIsExist function', () => {
      it('should response false when like is not available', async () => {
        // Action & Assert
        await expect(
          likeRepositoryPostgres.verifyLikeIsExist(
            payload.commentId,
            payload.owner
          )
        ).resolves.toBeFalsy()
      })

      it('should response true when like are available', async () => {
        // Action
        await LikesTableTestHelper.addLike({ id: 'likes-xyz' })

        // Assert
        await expect(
          likeRepositoryPostgres.verifyLikeIsExist(
            payload.commentId,
            payload.owner
          )
        ).resolves.toBeTruthy()
      })
    })
  })

  describe('deleteLike function', () => {
    it('should throw NotFoundError when like is not available', async () => {
      // Action & Assert
      await expect(
        likeRepositoryPostgres.deleteLike(payload.commentId, payload.owner)
      ).rejects.toThrowError(NotFoundError)
    })

    it('should delete like correctly when like is available', async () => {
      // Action
      await LikesTableTestHelper.addLike(payload)
      await expect(
        LikesTableTestHelper.getLikeById('likes-123')
      ).resolves.toHaveLength(1)

      await likeRepositoryPostgres.deleteLike(payload.commentId, payload.owner)

      // Assert
      await expect(
        LikesTableTestHelper.getLikeById('likes-123')
      ).resolves.toHaveLength(0)
    })
  })

  describe('getLikesByThreadId', () => {
    it('should return all likes from a thread correctly', async () => {
      // Action
      await UsersTableTestHelper.addUser({ id: 'user-xyz', username: 'xyz' })
      await LikesTableTestHelper.addLike(payload)
      await LikesTableTestHelper.addLike({ id: 'likes-xyz', owner: 'user-xyz' })

      const likes = await likeRepositoryPostgres.getLikesByThreadId(
        'thread-123'
      )

      expect(likes).toHaveLength(2)
    })

    it('should return an empty array when no likes exist for the thread', async () => {
      // Action
      const output = await likeRepositoryPostgres.getLikesByThreadId(
        'thread-123'
      )

      // Assert
      expect(output).toStrictEqual([])
      expect(output).toHaveLength(0)
    })
  })
})
