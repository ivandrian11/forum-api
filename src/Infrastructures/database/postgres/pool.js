/* istanbul ignore file */
const { Pool } = require('pg')
const { testConfig } = require('../../../Commons/config')

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool()

module.exports = pool
