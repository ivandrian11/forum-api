const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addThread function', () => {
    // Arange
    const payload = {
      title: 'Platform Belajar IT Terbaik',
      body: 'Menurutmu, platform belajar IT terbaik yang pernah kamu rasakan selama ini apa?',
      owner: 'user-123'
    }
    const fakeIdGenerator = () => 'xyz'
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(
      pool,
      fakeIdGenerator
    )

    it('should persist new thread', async () => {
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(payload)

      // Assert
      await expect(
        ThreadsTableTestHelper.getThreadById(addedThread.id)
      ).resolves.toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(payload)

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-xyz',
          title: payload.title,
          owner: payload.owner
        })
      )
    })
  })

  describe('verifyThreadIsExist function', () => {
    // Arrange
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

    it('should throw NotFoundError when thread not found', async () => {
      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadIsExist('xxx')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadIsExist('thread-123')
      ).resolves.not.toThrowError(NotFoundError)
      await expect(
        ThreadsTableTestHelper.getThreadById('thread-123')
      ).resolves.toHaveLength(1)
    })
  })

  describe('getThreadById function', () => {
    // Arrange
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

    it('should throw NotFoundError when thread not found', async () => {
      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('xxx')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123'
      })

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123')

      // Assert
      expect(thread.id).toBe('thread-123')
    })
  })
})
