const createServer = require('../createServer')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('/comments endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  // Arange
  const payload = {
    content: 'content of comment'
  }

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat comment karena properti tidak lengkap'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: { content: true },
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat comment karena tipe data masih salah'
      )
    })

    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload
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
        method: 'POST',
        url: '/threads/xxx/comments',
        payload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Thread tidak ditemukan')
    })

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveProperty('addedComment')
      expect(responseJson.data.addedComment).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    beforeEach(async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123' })
    })

    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 403 when user is not owner', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Kamu tidak memiliki hak akses untuk resource ini'
      )
    })

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/xxx/comments/comment-123',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Resource tidak ditemukan')
    })

    it('should response 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken, userId } = await ServerTestHelper.getCredentialData({
        server
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        threadId: 'thread-123',
        owner: userId
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-234',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const threadResponse = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')

      const threadJson = JSON.parse(threadResponse.payload)
      expect(threadJson.data.thread.comments[1].content).toBe(
        '**komentar telah dihapus**'
      )
    })
  })
})
