const AddThreadUseCase = require('../AddThreadUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const payload = {
      title: 'title of thread',
      body: 'body of thread',
      owner: 'user-123'
    }

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: payload.title,
      body: payload.body,
      owner: payload.owner,
      date: '2023-08-21T07:00:00.000Z'
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.addThread = jest.fn().mockResolvedValue(
      new AddedThread({
        id: 'thread-123',
        title: payload.title,
        body: payload.body,
        owner: payload.owner,
        date: '2023-08-21T07:00:00.000Z'
      })
    )

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(payload)

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread)
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(payload)
    )
  })
})
