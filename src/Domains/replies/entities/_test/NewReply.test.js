const NewReply = require('../NewReply')

describe('a NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = { owner: 'user-123' }

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      owner: 'user-123',
      content: true
    }

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.WRONG_DATA_TYPE'
    )
  })

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      owner: 'user-123',
      content: 'content of reply'
    }

    // Action
    const newReply = new NewReply(payload)

    // Assert
    expect(newReply).toBeInstanceOf(NewReply)
    expect(newReply).toEqual(payload)
  })
})
