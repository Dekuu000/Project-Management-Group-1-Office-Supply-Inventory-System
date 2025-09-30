import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    if (!db || typeof db.query !== 'function')
      return res.status(500).json({ error: 'DB connection failed.' });

    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM ReportTransactions');
      await db.end();
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { ReportId, TransactionId } = req.body;
      if (!ReportId || !TransactionId)
        return res.status(400).json({ error: 'ReportId & TransactionId required.' });
      await db.query(
        'INSERT INTO ReportTransactions (ReportId, TransactionId) VALUES (?, ?)',
        [ReportId, TransactionId]
      );
      await db.end();
      return res.status(201).json({ message: 'Relation created.' });
    }

    if (req.method === 'DELETE') {
      const { ReportId, TransactionId } = req.body;
      if (!ReportId || !TransactionId)
        return res.status(400).json({ error: 'ReportId & TransactionId required.' });
      await db.query('DELETE FROM ReportTransactions WHERE ReportId = ? AND TransactionId = ?', [ReportId, TransactionId]);
      await db.end();
      return res.status(200).json({ message: 'Relation deleted.' });
    }

    await db.end();
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('ReportTransactions error:', err);
    res.status(500).json({ error: err.message });
  }
}