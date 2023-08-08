class NewThread {
  constructor (payload) {
    this._verifyPayload(payload)

    const { title, body, owner } = payload
    this.title = title
    this.body = body
    this.owner = owner
  }

  _verifyPayload (payload) {
    const { title, body, owner } = payload

    if (!title || !body || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_THREAD.WRONG_DATA_TYPE')
    }
  }
}

module.exports = NewThread
