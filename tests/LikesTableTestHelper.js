/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const LikesTableTestHelper = {
  async addLike ({
    id = 'likes-123',
    commentId = 'comment-123',
    owner = 'user-123',
    date = new Date('2023-08-21T00:00:00.000Z')
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, date, owner, commentId]
    }

    await pool.query(query)
  },

  async getLikeById (id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM likes WHERE 1=1')
  }
}

module.exports = LikesTableTestHelper
