/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadTableTestHelper = {
  async addThread ({
    id = 'thread-123',
    title = 'title of thread',
    body = 'body of thread',
    owner = 'user-123',
    date = new Date('2023-08-21T00:00:00.000Z')
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, owner]
    }

    await pool.query(query)
  },

  async getThreadById (id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

module.exports = ThreadTableTestHelper
