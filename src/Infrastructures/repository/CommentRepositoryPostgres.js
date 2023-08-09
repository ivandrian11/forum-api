const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment (newComment) {
    const { content, threadId, owner } = newComment

    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, owner, threadId]
    }

    const { rows } = await this._pool.query(query)

    return new AddedComment({ ...rows[0] })
  }

  async verifyIsTheOwner (commentId, owner) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner]
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new AuthorizationError(
        'Kamu tidak memiliki hak akses untuk resource ini'
      )
    }

    return rowCount
  }

  async verifyCommentIsExist (commentId, threadId) {
    const query = {
      text: `SELECT 1
            FROM comments WHERE id = $1 
            AND thread_id = $2`,
      values: [commentId, threadId]
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('Resource tidak ditemukan')
    }

    return rowCount
  }

  async deleteCommentById (commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1',
      values: [commentId]
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('Resource tidak ditemukan')
    }

    return rowCount
  }

  async getCommentsByThreadId (threadId) {
    const query = {
      text: `SELECT c.id, c.date, u.username,
            CASE WHEN c.is_deleted THEN '**komentar telah dihapus**'
            ELSE c.content END AS content
            FROM comments c
            JOIN users u ON c.owner = u.id
            WHERE c.thread_id = $1
            ORDER BY c.date ASC`,
      values: [threadId]
    }
    const { rows } = await this._pool.query(query)

    return rows
  }
}

module.exports = CommentRepositoryPostgres
