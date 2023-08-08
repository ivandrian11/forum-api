const NewThread = require('../NewThread')

describe('a NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title of thread'
    }

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'title of thread',
      body: true,
      owner: true
    }

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.WRONG_DATA_TYPE'
    )
  })

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'title of thread',
      body: 'body of thread',
      owner: 'user-123'
    }

    // Action
    const newThread = new NewThread(payload)

    // Assert
    expect(newThread).toBeInstanceOf(NewThread)
    expect(newThread).toEqual(payload)
  })
})
