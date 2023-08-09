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

    comments = comments.map(comment => ({
      ...comment,
      likeCount: likes.filter(reply => reply.comment_id === comment.id).length,
      replies: replies
        .filter(reply => reply.comment_id === comment.id)
        .map(({ comment_id, ...props }) => props)
    }))

    return {
      ...thread,
      comments
    }
  }
}

module.exports = GetDetailThreadUseCase
