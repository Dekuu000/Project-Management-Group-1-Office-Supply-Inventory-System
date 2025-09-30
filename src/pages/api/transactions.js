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
      const [rows] = await db.query('SELECT * FROM Transactions');
      await db.end();
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { SupplyId, UserId, Date, Type, Quantity, Remarks } = req.body;
      if (!SupplyId || !UserId || !Date || !Type || !Quantity)
        return res.status(400).json({ error: 'Required fields missing.' });
      const [result] = await db.query(
        'INSERT INTO Transactions (SupplyId, UserId, Date, Type, Quantity, Remarks) VALUES (?, ?, ?, ?, ?, ?)',
        [SupplyId, UserId, Date, Type, Quantity, Remarks]
      );
      await db.end();
      return res.status(201).json({ id: result.insertId, message: 'Transaction created.' });
    }

    if (req.method === 'PUT') {
      const { TransactionId, ...fields } = req.body;
      if (!TransactionId) return res.status(400).json({ error: 'TransactionId required.' });
      const keys = Object.keys(fields);
      const values = Object.values(fields);
      const setString = keys.map(k => `${k} = ?`).join(', ');
      await db.query(
        `UPDATE Transactions SET ${setString} WHERE TransactionId = ?`,
        [...values, TransactionId]
      );
      await db.end();
      return res.status(200).json({ message: 'Transaction updated.' });
    }

    if (req.method === 'DELETE') {
      const { TransactionId } = req.body;
      if (!TransactionId) return res.status(400).json({ error: 'TransactionId required.' });
      await db.query('DELETE FROM Transactions WHERE TransactionId = ?', [TransactionId]);
      await db.end();
      return res.status(200).json({ message: 'Transaction deleted.' });
    }

    await db.end();
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Transactions error:', err);
    res.status(500).json({ error: err.message });
  }
}