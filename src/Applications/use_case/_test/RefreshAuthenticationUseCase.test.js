const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase')
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const payload = {}
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // Action & Assert
    await expect(
      refreshAuthenticationUseCase.execute(payload)
    ).rejects.toThrowError(
      'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    )
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const payload = {
      refreshToken: 1
    }
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // Action & Assert
    await expect(
      refreshAuthenticationUseCase.execute(payload)
    ).rejects.toThrowError(
      'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_WRONG_DATA_TYPE'
    )
  })

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'some_refresh_token'
    }
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()

    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockResolvedValue()
    mockAuthenticationTokenManager.verifyRefreshToken = jest
      .fn()
      .mockResolvedValue()
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockResolvedValue({ username: 'postgres', id: 'user-123' })
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockResolvedValue('some_new_access_token')

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager
    })

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(payload)

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(
      payload.refreshToken
    )
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      payload.refreshToken
    )
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      payload.refreshToken
    )
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'postgres',
      id: 'user-123'
    })
    expect(accessToken).toEqual('some_new_access_token')
  })
})
