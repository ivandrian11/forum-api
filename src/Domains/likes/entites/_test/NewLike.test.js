const NewLike = require('../NewLike')

describe('a NewLike entities', () => {
  it('should throw error when commentId is missing', () => {
    // Arrange
    const payload = { owner: 'user-123' }

    // Action and Assert
    expect(() => new NewLike(payload)).toThrowError(
      'NEW_LIKE.RESOURCE_NOT_FOUND'
    )
  })

  it('should throw error when owner is missing', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123'
    }

    // Action and Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.MISSING_TOKEN')
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
    expect(newLike.commentId).toEqual(payload.commentId)
    expect(newLike.owner).toEqual(payload.owner)
  })
})
