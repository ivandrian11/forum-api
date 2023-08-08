/* istanbul ignore file */
const ServerTestHelper = {
  async getCredentialData ({ server, username = 'oppenheimer' }) {
    const payload = {
      username: username + Math.random().toString().substring(2, 5),
      password: 'password'
    }

    const user = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...payload,
        fullname: 'Julius Robert Oppenheimer'
      }
    })

    const auth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload
    })

    const { id: userId } = JSON.parse(user.payload).data.addedUser
    const { accessToken } = JSON.parse(auth.payload).data
    return { userId, accessToken }
  }
}

module.exports = ServerTestHelper
