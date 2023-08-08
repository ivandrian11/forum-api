const AddedReply = require('../AddedReply')

describe('a AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'content of reply'
    }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      owner: 'user-123',
      content: true
    }

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLY.WRONG_DATA_TYPE'
    )
  })

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      content: 'content of reply'
    }

    // Action
    const addedReply = new AddedReply(payload)

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply)
    expect(addedReply).toEqual(payload)
  })
})
