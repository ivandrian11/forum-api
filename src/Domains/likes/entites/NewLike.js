class NewLike {
  constructor (payload) {
    this._verifyPayload(payload)

    const { commentId, owner } = payload
    this.commentId = commentId
    this.owner = owner
  }

  _verifyPayload (payload) {
    const { commentId, owner } = payload

    if (!commentId || !owner) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_LIKE.WRONG_DATA_TYPE')
    }
  }
}

module.exports = NewLike
