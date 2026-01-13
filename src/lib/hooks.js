connectionString = process.env.DATABASE_URL
const { Pool } = require('pg');
pool.on('connect', () => {
    console.log('Database connection successful');
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});
const pool = new Pool({
  connectionString,
});

module.exports = {
  query: (text, params) => pool.query("SELECT * FROM public.bpeanut", params),
};
