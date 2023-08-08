class NewReply {
  constructor (payload) {
    this._verifyPayload(payload)

    const { content, commentId, owner } = payload
    this.content = content
    this.commentId = commentId
    this.owner = owner
  }

  _verifyPayload (payload) {
    const { content, commentId, owner } = payload

    if (!content || !commentId || !owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (
      typeof content !== 'string' ||
      typeof commentId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_REPLY.WRONG_DATA_TYPE')
    }
  }
}

module.exports = NewReply
