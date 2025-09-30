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
      const [rows] = await db.query('SELECT * FROM Supplies');
      await db.end();
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { Name, Description, Quantity = 0, Category, Location, SupplierId } = req.body;
      if (!Name) return res.status(400).json({ error: 'Name required.' });
      const [result] = await db.query(
        'INSERT INTO Supplies (Name, Description, Quantity, Category, Location, SupplierId) VALUES (?, ?, ?, ?, ?, ?)',
        [Name, Description, Quantity, Category, Location, SupplierId]
      );
      await db.end();
      return res.status(201).json({ id: result.insertId, message: 'Supply created.' });
    }

    if (req.method === 'PUT') {
      const { SupplyId, ...fields } = req.body;
      if (!SupplyId) return res.status(400).json({ error: 'SupplyId required.' });
      const keys = Object.keys(fields);
      const values = Object.values(fields);
      const setString = keys.map(k => `${k} = ?`).join(', ');
      await db.query(
        `UPDATE Supplies SET ${setString} WHERE SupplyId = ?`,
        [...values, SupplyId]
      );
      await db.end();
      return res.status(200).json({ message: 'Supply updated.' });
    }

    if (req.method === 'DELETE') {
      const { SupplyId } = req.body;
      if (!SupplyId) return res.status(400).json({ error: 'SupplyId required.' });
      await db.query('DELETE FROM Supplies WHERE SupplyId = ?', [SupplyId]);
      await db.end();
      return res.status(200).json({ message: 'Supply deleted.' });
    }

    await db.end();
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Supplies error:', err);
    res.status(500).json({ error: err.message });
  }
}

