import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'development',
  password: 'Jrcumayas123',
  database: 'users',
});

export { connection };