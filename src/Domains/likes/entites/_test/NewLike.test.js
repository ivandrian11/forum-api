const NewLike = require('../NewLike')

describe('a NewLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = { owner: 'user-123' }

    // Action and Assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: true,
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.WRONG_DATA_TYPE')
  })

  it('should create NewLike object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123'
    }

    // Action
    const newLike = new NewLike(payload)

    // Assert
    expect(newLike).toBeInstanceOf(NewLike)
    expect(newLike).toEqual(payload)
  })
})
