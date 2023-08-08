class DetailThread {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, title, body, date, username } = payload
    this.id = id
    this.title = title
    this.body = body
    this.date = date
    this.username = username
  }

  _verifyPayload (payload) {
    const { id, title, body, date, username } = payload

    if (!id || !title || !body || !date || !username) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('DETAIL_THREAD.WRONG_DATA_TYPE')
    }
  }
}

module.exports = DetailThread
