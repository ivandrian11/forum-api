const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const ReplyRepository = require('../../Domains/replies/ReplyRepository')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply (newReply) {
    const { content, commentId, owner } = newReply

    const id = `reply-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, owner, commentId]
    }

    const { rows } = await this._pool.query(query)

    return new AddedReply({ ...rows[0] })
  }

  async verifyIsTheOwner (replyId, owner) {
    const query = {
      text: 'SELECT 1 FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner]
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new AuthorizationError(
        'Kamu tidak memiliki hak akses untuk resource ini'
      )
    }
  }

  async verifyReplyIsExist (replyId, commentId, threadId) {
    const query = {
      text: `SELECT 1 
            FROM replies r
            JOIN comments c ON r.comment_id = c.id
            WHERE r.id = $1
            AND r.comment_id = $2
            AND c.thread_id = $3
            AND r.is_deleted = false`,
      values: [replyId, commentId, threadId]
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('Resource tidak ditemukan')
    }
  }

  async deleteReplyById (replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [replyId]
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('Resource tidak ditemukan')
    }
  }

  async getRepliesByThreadId (threadId) {
    const query = {
      text: `SELECT r.id, r.date, u.username, r.comment_id,
            r.is_deleted, r.content
            FROM replies r
            JOIN comments c ON r.comment_id = c.id
            JOIN users u ON r.owner = u.id
            WHERE c.thread_id = $1
            ORDER BY r.date ASC`,
      values: [threadId]
    }

    const { rows } = await this._pool.query(query)

    return rows
  }
}

module.exports = ReplyRepositoryPostgres
