const LikeRepository = require('../../Domains/likes/LikeRepository')

class LikeRepositoryPostgres extends LikeRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addLike (newLike) {
    const { commentId, owner } = newLike

    const id = `like-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, date, owner, commentId]
    }

    const { rows } = await this._pool.query(query)

    return rows[0].id
  }
}

module.exports = LikeRepositoryPostgres
