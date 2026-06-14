import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT) || 3306,
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASS || '',
  database: process.env.DB_NAME || process.env.MYSQL_DB || 'db_equipo_15',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

export async function testDatabaseConnection(): Promise<void> {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}

export default pool;
