const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase')
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const payload = {}
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

    // Action & Assert
    await expect(
      deleteAuthenticationUseCase.execute(payload)
    ).rejects.toThrowError(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    )
  })

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const payload = {
      refreshToken: 123
    }
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

    // Action & Assert
    await expect(
      deleteAuthenticationUseCase.execute(payload)
    ).rejects.toThrowError(
      'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_WRONG_DATA_TYPE'
    )
  })

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refreshToken'
    }
    const mockAuthenticationRepository = new AuthenticationRepository()
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockResolvedValue()
    mockAuthenticationRepository.deleteToken = jest.fn().mockResolvedValue()

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository
    })

    // Action
    await deleteAuthenticationUseCase.execute(payload)

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(payload.refreshToken)
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      payload.refreshToken
    )
  })
})
