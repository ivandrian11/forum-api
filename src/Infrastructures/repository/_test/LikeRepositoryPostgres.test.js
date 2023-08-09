const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')

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

      // Assert
      await expect(LikesTableTestHelper.getLikeById(id)).resolves.toHaveLength(
        1
      )
    })
  })
})
