class AddedComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, content, owner } = payload
    this.id = id
    this.content = content
    this.owner = owner
  }

  _verifyPayload (payload) {
    const { id, content, owner } = payload

    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.WRONG_DATA_TYPE')
    }
  }
}

module.exports = AddedComment
