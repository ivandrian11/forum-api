const NewComment = require('../NewComment')

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = { owner: 'user-123' }

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: true,
      owner: 'user-123',
      content: true
    }

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.WRONG_DATA_TYPE'
    )
  })

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'content of comment'
    }

    // Action
    const newComment = new NewComment(payload)

    // Assert
    expect(newComment).toBeInstanceOf(NewComment)
    expect(newComment).toEqual(payload)
  })
})
