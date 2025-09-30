// pages/api/test-db.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.query('SHOW TABLES');
    await db.end();

    res.status(200).json({ tables: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}