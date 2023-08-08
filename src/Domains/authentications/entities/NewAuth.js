class NewAuth {
  constructor (payload) {
    this._verifyPayload(payload)

    this.accessToken = payload.accessToken
    this.refreshToken = payload.refreshToken
  }

  _verifyPayload (payload) {
    const { accessToken, refreshToken } = payload

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.WRONG_DATA_TYPE')
    }
  }
}

module.exports = NewAuth
