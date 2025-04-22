const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM admins WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = results[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, 'secret_key', {
      expiresIn: '1d'
    });

    res.json({ message: 'Login successful', token });
  });
};

module.exports = { login };
