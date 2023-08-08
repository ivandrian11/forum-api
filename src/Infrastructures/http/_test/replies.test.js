const createServer = require('../createServer')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

describe('/replies endpoint', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
    await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
    await CommentsTableTestHelper.addComment({ id: 'comment-123' })
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  // Arange
  const payload = {
    content: 'content of reply'
  }

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat reply karena properti tidak lengkap'
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
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: { content: true },
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat reply karena tipe data masih salah'
      )
    })

    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container)
      await ServerTestHelper.getCredentialData({ server })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
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
        url: '/threads/xxx/comments/comment-123/replies',
        payload,
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
        method: 'POST',
        url: '/threads/thread-123/comments/xxx/replies',
        payload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Resource tidak ditemukan')
    })

    it('should response 201 and persisted reply', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveProperty('addedReply')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    beforeEach(async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123' })
    })

    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
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
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
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
        url: '/threads/xxx/comments/comment-123/replies/reply-123',
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/xxx/replies/reply-123',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Resource tidak ditemukan')
    })

    it('should response 404 when reply not found', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/xxx',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Resource tidak ditemukan')
    })

    it('should response 200 and delete reply', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken, userId } = await ServerTestHelper.getCredentialData({
        server
      })
      await RepliesTableTestHelper.addReply({
        id: 'reply-321',
        commentId: 'comment-123',
        owner: userId
      })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-321',
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
      expect(threadJson.data.thread.comments[0].replies[1].content).toBe(
        '**balasan telah dihapus**'
      )
    })
  })
})
