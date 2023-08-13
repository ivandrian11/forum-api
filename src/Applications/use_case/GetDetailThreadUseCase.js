class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute (threadId) {
    const thread = await this._threadRepository.getThreadById(threadId)
    let comments = await this._commentRepository.getCommentsByThreadId(threadId)
    const replies = await this._replyRepository.getRepliesByThreadId(threadId)

    comments = comments.map(({ is_deleted, content, ...props }) => ({
      ...props,
      content: is_deleted ? '**komentar telah dihapus**' : content,
      replies: replies
        .filter(reply => reply.comment_id === props.id)
        .map(({ comment_id, content, is_deleted, ...props }) => ({
          ...props,
          content: is_deleted ? '**balasan telah dihapus**' : content
        }))
    }))

    return {
      ...thread,
      comments
    }
  }
}

module.exports = GetDetailThreadUseCase
