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

    // GET: Fetch users
    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM Users');
      await db.end();
      return res.status(200).json(rows);
    }

    // POST: Create user
    if (req.method === 'POST') {
      const { Name, Role } = req.body;
      if (!Name || !Role) return res.status(400).json({ error: 'Name and Role required.' });
      const [result] = await db.query('INSERT INTO Users (Name, Role) VALUES (?, ?)', [Name, Role]);
      await db.end();
      return res.status(201).json({ id: result.insertId, message: 'User created.' });
    }

    // PUT: Update user (by UserId in body)
    if (req.method === 'PUT') {
      const { UserId, ...fields } = req.body;
      if (!UserId) return res.status(400).json({ error: 'UserId required.' });
      const keys = Object.keys(fields);
      const values = Object.values(fields);
      if (keys.length === 0) return res.status(400).json({ error: 'Nothing to update.' });
      const setString = keys.map(k => `\`${k}\` = ?`).join(', ');
      await db.query(`UPDATE Users SET ${setString} WHERE UserId = ?`, [...values, UserId]);
      await db.end();
      return res.status(200).json({ message: 'User updated.' });
    }

    // DELETE: Delete user (by UserId in body)
    if (req.method === 'DELETE') {
      const { UserId } = req.body;
      if (!UserId) return res.status(400).json({ error: 'UserId required.' });
      await db.query('DELETE FROM Users WHERE UserId = ?', [UserId]);
      await db.end();
      return res.status(200).json({ message: 'User deleted.' });
    }

    await db.end();
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ error: err.message });
  }
}