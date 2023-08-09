class NewLike {
  constructor (payload) {
    this._verifyPayload(payload)

    const { commentId, owner } = payload
    this.commentId = commentId
    this.owner = owner
  }

  _verifyPayload (payload) {
    const { commentId, owner } = payload

    if (!commentId) {
      throw new Error('NEW_LIKE.RESOURCE_NOT_FOUND')
    }

    if (!owner) {
      throw new Error('NEW_LIKE.MISSING_TOKEN')
    }
  }
}

module.exports = NewLike
