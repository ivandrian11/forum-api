class GetDetailThreadUseCase {
  constructor ({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository
  }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
    this._likeRepository = likeRepository
  }

  async execute (threadId) {
    const thread = await this._threadRepository.getThreadById(threadId)
    let comments = await this._commentRepository.getCommentsByThreadId(threadId)
    const replies = await this._replyRepository.getRepliesByThreadId(threadId)
    const likes = await this._likeRepository.getLikesByThreadId(threadId)

    comments = comments.map(({ is_deleted, content, ...props }) => ({
      ...props,
      content: is_deleted ? '**komentar telah dihapus**' : content,
      likeCount: likes.filter(reply => reply.comment_id === props.id).length,
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
