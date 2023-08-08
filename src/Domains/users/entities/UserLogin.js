class UserLogin {
  constructor (payload) {
    this._verifyPayload(payload)

    this.username = payload.username
    this.password = payload.password
  }

  _verifyPayload (payload) {
    const { username, password } = payload

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.WRONG_DATA_TYPE')
    }
  }
}

module.exports = UserLogin
