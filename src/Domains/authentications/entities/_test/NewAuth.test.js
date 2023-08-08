const NewAuth = require('../NewAuth')

describe('NewAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken'
    }

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 1234
    }

    // Action & Assert
    expect(() => new NewAuth(payload)).toThrowError(
      'NEW_AUTH.WRONG_DATA_TYPE'
    )
  })

  it('should create NewAuth entities correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    }

    // Action
    const newAuth = new NewAuth(payload)

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth)
    expect(newAuth.accessToken).toEqual(payload.accessToken)
    expect(newAuth.refreshToken).toEqual(payload.refreshToken)
  })
})
