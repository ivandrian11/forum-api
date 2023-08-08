const LoginUserUseCase = require('../LoginUserUseCase')
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')
const UserRepository = require('../../../Domains/users/UserRepository')
const PasswordHash = require('../../security/PasswordHash')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const NewAuth = require('../../../Domains/authentications/entities/NewAuth')

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const payload = {
      username: 'postgres',
      password: 'password'
    }
    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })
    const mockUserRepository = new UserRepository()
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()
    const mockPasswordHash = new PasswordHash()

    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockResolvedValue('encrypted_password')
    mockPasswordHash.comparePassword = jest.fn().mockResolvedValue()
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockResolvedValue(mockedAuthentication.accessToken)
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockResolvedValue(mockedAuthentication.refreshToken)
    mockUserRepository.getIdByUsername = jest.fn().mockResolvedValue('user-123')
    mockAuthenticationRepository.addToken = jest.fn().mockResolvedValue()

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash
    })

    // Action
    const actualAuthentication = await loginUserUseCase.execute(payload)

    // Assert
    expect(actualAuthentication).toEqual(mockedAuthentication)
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('postgres')
    expect(mockPasswordHash.comparePassword).toBeCalledWith(
      'password',
      'encrypted_password'
    )
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('postgres')
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'postgres',
      id: 'user-123'
    })
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: 'postgres',
      id: 'user-123'
    })
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      mockedAuthentication.refreshToken
    )
  })
})
