const AddedComment = require('../AddedComment')

describe('an AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = { owner: 'user-123' }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      content: true
    }

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.WRONG_DATA_TYPE'
    )
  })

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'a comment',
      owner: 'user-123'
    }

    // Action
    const addedComment = new AddedComment(payload)

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment)
    expect(addedComment).toEqual(payload)
  })
})
