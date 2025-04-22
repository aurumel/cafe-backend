const bcrypt = require('bcrypt');
const db = require('./models/db'); // sesuaikan path kalau beda

const name = 'Admin';
const username = 'admin';
const plainPassword = 'admin123';

bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  const query = 'INSERT INTO admins (name, username, password) VALUES (?, ?, ?)';
  db.query(query, [name, username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting admin:', err);
    } else {
      console.log('Admin created successfully!');
    }
    process.exit(); // keluar dari script setelah selesai
  });
});
