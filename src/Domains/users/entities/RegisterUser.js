class RegisterUser {
  constructor (payload) {
    this._verifyPayload(payload)

    const { username, password, fullname } = payload

    this.username = username
    this.password = password
    this.fullname = fullname
  }

  _verifyPayload ({ username, password, fullname }) {
    if (!username || !password || !fullname) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof fullname !== 'string'
    ) {
      throw new Error('REGISTER_USER.WRONG_DATA_TYPE')
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
    }
  }
}

module.exports = RegisterUser
