class NewComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { content, threadId, owner } = payload
    this.content = content
    this.threadId = threadId
    this.owner = owner
  }

  _verifyPayload (payload) {
    const { content, threadId, owner } = payload

    if (!content || !threadId || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_PROPERTY_CORRECTLY')
    }

    if (
      typeof content !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_COMMENT.WRONG_DATA_TYPE')
    }
  }
}

module.exports = NewComment
