const AddUserUseCase = require('../AddUserUseCase')
const UserRepository = require('../../../Domains/users/UserRepository')
const PasswordHash = require('../../security/PasswordHash')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser')

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const payload = {
      username: 'postgres',
      password: 'password',
      fullname: 'PostgreSQL'
    }

    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: payload.username,
      fullname: payload.fullname
    })

    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    mockUserRepository.verifyAvailableUsername = jest.fn().mockResolvedValue()
    mockPasswordHash.hash = jest.fn().mockResolvedValue('encrypted_password')
    mockUserRepository.addUser = jest.fn().mockResolvedValue(
      new RegisteredUser({
        id: 'user-123',
        username: payload.username,
        fullname: payload.fullname
      })
    )

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    // Action
    const registeredUser = await getUserUseCase.execute(payload)

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser)
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      payload.username
    )
    expect(mockPasswordHash.hash).toBeCalledWith(payload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: payload.username,
        password: 'encrypted_password',
        fullname: payload.fullname
      })
    )
  })
})
