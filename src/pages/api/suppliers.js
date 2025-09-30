import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    if (!db || typeof db.query !== 'function') {
      return res.status(500).json({ error: 'DB connection failed.' });
    }

    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM Suppliers');
      await db.end();
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { Name, Contact } = req.body;
      if (!Name) return res.status(400).json({ error: 'Name required.' });
      const [result] = await db.query(
        'INSERT INTO Suppliers (Name, Contact) VALUES (?, ?)', [Name, Contact]
      );
      await db.end();
      return res.status(201).json({ id: result.insertId, message: 'Supplier created.' });
    }

    await db.end();
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Suppliers error:', err);
    res.status(500).json({ error: err.message });
  }
}