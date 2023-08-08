const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const autoBind = require('auto-bind')
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase')

class ThreadHandler {
  constructor (container) {
    this._container = container

    autoBind(this)
  }

  async postThreadHandler ({ payload, auth }, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute({
      title: payload.title,
      body: payload.body,
      owner: auth.credentials.id
    })

    const response = h.response({
      status: 'success',
      message: 'Thread berhasil ditambahkan',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getThreadByIdHandler (request) {
    const getThreadByIdUseCase = this._container.getInstance(
      GetDetailThreadUseCase.name
    )
    const thread = await getThreadByIdUseCase.execute(request.params.threadId)

    return {
      status: 'success',
      data: {
        thread
      }
    }
  }
}

module.exports = ThreadHandler
