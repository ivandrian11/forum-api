const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const LikeRepository = require('../../Domains/likes/LikeRepository')

class LikeRepositoryPostgres extends LikeRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addLike (newLike) {
    const { commentId, owner } = newLike

    const id = `likes-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, date, owner, commentId]
    }

    const { rows } = await this._pool.query(query)

    return rows[0].id
  }

  async verifyLikeIsExist (commentId, owner) {
    const query = {
      text: `SELECT 1 
            FROM likes
            WHERE comment_id = $1
            AND owner = $2`,
      values: [commentId, owner]
    }

    const { rowCount } = await this._pool.query(query)

    return rowCount
  }

  async deleteLike (commentId, owner) {
    const query = {
      text: `DELETE FROM likes
            WHERE comment_id = $1
            AND owner = $2`,
      values: [commentId, owner]
    }

    const { rowCount } = await this._pool.query(query)

    if (!rowCount) {
      throw new NotFoundError('Resource tidak ditemukan')
    }

    return rowCount
  }

  async getLikesByThreadId (threadId) {
    const query = {
      text: `SELECT l.id
            FROM likes l
            JOIN comments c ON l.comment_id = c.id
            WHERE c.thread_id = $1`,
      values: [threadId]
    }

    const { rows } = await this._pool.query(query)

    return rows
  }
}

module.exports = LikeRepositoryPostgres
