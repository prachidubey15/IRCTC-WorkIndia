const sql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = sql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((error, conn) => {
  if (error) {
    console.error('connection failed: ', error.message);
  } else {
    console.log('Successfully connected to Database');
    conn.release(); 
  }
});

module.exports = pool.promise();