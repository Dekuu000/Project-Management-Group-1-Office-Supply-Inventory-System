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
      const [rows] = await db.query('SELECT * FROM Reports');
      await db.end();
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { Title, CreatedDate, CreatorId } = req.body;
      if (!Title || !CreatedDate) return res.status(400).json({ error: 'Title & CreatedDate required.' });
      const [result] = await db.query(
        'INSERT INTO Reports (Title, CreatedDate, CreatorId) VALUES (?, ?, ?)',
        [Title, CreatedDate, CreatorId]
      );
      await db.end();
      return res.status(201).json({ id: result.insertId, message: 'Report created.' });
    }

    if (req.method === 'PUT') {
      const { ReportId, ...fields } = req.body;
      if (!ReportId) return res.status(400).json({ error: 'ReportId required.' });
      const keys = Object.keys(fields);
      const values = Object.values(fields);
      const setString = keys.map(k => `${k} = ?`).join(', ');
      await db.query(
        `UPDATE Reports SET ${setString} WHERE ReportId = ?`,
        [...values, ReportId]
      );
      await db.end();
      return res.status(200).json({ message: 'Report updated.' });
    }

    if (req.method === 'DELETE') {
      const { ReportId } = req.body;
      if (!ReportId) return res.status(400).json({ error: 'ReportId required.' });
      await db.query('DELETE FROM Reports WHERE ReportId = ?', [ReportId]);
      await db.end();
      return res.status(200).json({ message: 'Report deleted.' });
    }

    await db.end();
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Reports error:', err);
    res.status(500).json({ error: err.message });
  }
}