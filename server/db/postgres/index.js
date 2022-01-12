const { Pool } = require('pg');
const config = require('../../../config');

const pool = new Pool(config.postgres);
pool.connect();

module.exports = {
  // promise
  query: (text, params) => pool.query(text, params),
};
