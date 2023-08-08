/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentTableTestHelper = {
  async addComment ({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    content = 'content of comment',
    date = new Date('2023-08-21T00:00:00.000Z')
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, date, owner, threadId]
    }

    await pool.query(query)
  },

  async getCommentById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  }
}

module.exports = CommentTableTestHelper
