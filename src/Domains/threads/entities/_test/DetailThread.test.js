const DetailThread = require('../DetailThread')

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = { username: 'user-123' }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_PROPERTY_CORRECTLY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'title of thread',
      body: 'body of thread',
      username: 'user-123',
      date: '2023-08-21T07:00:00.000Z'
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.WRONG_DATA_TYPE'
    )
  })

  it('should create DetailThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title of thread',
      body: 'body of thread',
      username: 'user-123',
      date: '2023-08-21T07:00:00.000Z'
    }

    // Action
    const detailThread = new DetailThread(payload)

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread)
    expect(detailThread.id).toEqual(payload.id)
    expect(detailThread.title).toEqual(payload.title)
    expect(detailThread.body).toEqual(payload.body)
    expect(detailThread.username).toEqual(payload.username)
    expect(detailThread.date).toEqual(payload.date)
  })
})
