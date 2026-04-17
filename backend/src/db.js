const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.POSTGRES_HOST,
  port:     process.env.POSTGRES_PORT,
  user:     process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error en el pool de PostgreSQL:', err.message);
});

module.exports = pool;