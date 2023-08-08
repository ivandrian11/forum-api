const createServer = require('../createServer')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('/users endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /users', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        fullname: 'PostgreSQL',
        password: 'password'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat user karena properti tidak lengkap'
      )
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        username: 'postgres',
        password: 'password',
        fullname: true
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'Gagal membuat user karena tipe data masih salah'
      )
    })

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const payload = {
        username: 'postgresindonesiapostgresindonesiapostgresindonesiapostgres',
        password: 'password',
        fullname: 'PostgreSQL'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit'
      )
    })

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const payload = {
        username: 'Postgre SQL',
        password: 'password',
        fullname: 'PostgreSQL'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
      )
    })

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'postgres' })
      const payload = {
        username: 'postgres',
        fullname: 'PostgreSQL',
        password: 'super_password'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak tersedia')
    })
  })

  it('should response 201 and persisted user', async () => {
    // Arrange
    const payload = {
      username: 'postgres',
      password: 'password',
      fullname: 'PostgreSQL'
    }

    const server = await createServer(container)

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload
    })

    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(201)
    expect(responseJson.status).toEqual('success')
    expect(responseJson.data.addedUser).toBeDefined()
  })
})
