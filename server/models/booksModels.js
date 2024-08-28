const { Pool } = require('pg');

// add elephant SQL url here. Queries to create tables are below :) 
const PG_URI = 'postgres://lqksgrmm:s11cLWh9kbkjbzvkZ_BL7GD3P1ua50lO@kashin.db.elephantsql.com/lqksgrmm';

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
