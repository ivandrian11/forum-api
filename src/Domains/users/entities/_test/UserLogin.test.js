const UserLogin = require('../UserLogin')

describe('UserLogin entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'postgres'
    }

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 'postgres',
      password: true
    }

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrowError(
      'USER_LOGIN.WRONG_DATA_TYPE'
    )
  })

  it('should create UserLogin entities correctly', () => {
    // Arrange
    const payload = {
      username: 'postgres',
      password: 'password'
    }

    // Action
    const userLogin = new UserLogin(payload)

    // Assert
    expect(userLogin).toBeInstanceOf(UserLogin)
    expect(userLogin.username).toEqual(payload.username)
    expect(userLogin.password).toEqual(payload.password)
  })
})
