class RegisteredUser {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, username, fullname } = payload

    this.id = id
    this.username = username
    this.fullname = fullname
  }

  _verifyPayload ({ id, username, fullname }) {
    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof fullname !== 'string'
    ) {
      throw new Error('REGISTERED_USER.WRONG_DATA_TYPE')
    }
  }
}

module.exports = RegisteredUser
