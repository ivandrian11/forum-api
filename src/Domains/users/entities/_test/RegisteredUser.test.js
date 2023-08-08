const RegisteredUser = require('../RegisteredUser')

describe('a RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'postgres',
      fullname: 'PostgreSQL'
    }

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError(
      'REGISTERED_USER.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'postgres',
      fullname: {}
    }

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError(
      'REGISTERED_USER.WRONG_DATA_TYPE'
    )
  })

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'postgres',
      fullname: 'PostgreSQL'
    }

    // Action
    const registeredUser = new RegisteredUser(payload)

    // Assert
    expect(registeredUser.id).toEqual(payload.id)
    expect(registeredUser.username).toEqual(payload.username)
    expect(registeredUser.fullname).toEqual(payload.fullname)
  })
})
