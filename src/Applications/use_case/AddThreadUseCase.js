const NewThread = require('../../Domains/threads/entities/NewThread')
const AddedThread = require('../../Domains/threads/entities/AddedThread')

class AddThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (payload) {
    const newThread = new NewThread(payload)
    const addedThread = await this._threadRepository.addThread(newThread)
    return new AddedThread(addedThread)
  }
}

module.exports = AddThreadUseCase
