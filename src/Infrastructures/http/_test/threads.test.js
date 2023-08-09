const createServer = require('../createServer')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

describe('/threads endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' })
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('when POST /threads', () => {
    // Arrange
    const payload = {
      title: 'a thread',
      body: 'body of thread'
    }

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const badPayload = { title: 'a thread' }
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: badPayload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat thread karena properti tidak lengkap'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const badPayload = {
        title: 'a thread',
        body: true
      }
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: badPayload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat thread karena tipe data masih salah'
      )
    })

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container)
      const { accessToken } = await ServerTestHelper.getCredentialData({
        server
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveProperty('addedThread')
      expect(responseJson.data.addedThread).toBeDefined()
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Resource tidak ditemukan')
    })

    it('should response 200 and array of thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
    })
  })
})
