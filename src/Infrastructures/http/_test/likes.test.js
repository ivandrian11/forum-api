const createServer = require('../createServer')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')

describe('/likes endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
    await CommentsTableTestHelper.addComment({ id: 'comment-123' })
  })

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/xxx/comments/comment-123/likes',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Resource tidak ditemukan')
    })

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/xxx/likes',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Resource tidak ditemukan')
    })

    it('should response 201 and persisted like', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
