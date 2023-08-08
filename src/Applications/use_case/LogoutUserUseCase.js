class LogoutUserUseCase {
  constructor ({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository
  }

  async execute (payload) {
    this._validatePayload(payload)
    const { refreshToken } = payload
    await this._authenticationRepository.checkAvailabilityToken(refreshToken)
    await this._authenticationRepository.deleteToken(refreshToken)
  }

  _validatePayload (payload) {
    const { refreshToken } = payload
    if (!refreshToken) {
      throw new Error(
        'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
      )
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_WRONG_DATA_TYPE')
    }
  }
}

module.exports = LogoutUserUseCase
