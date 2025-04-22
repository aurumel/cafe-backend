const db = require('./db');

const getAllTables = (callback) => {
  db.query('SELECT * FROM tables', callback);
};

const getTableById = (id, callback) => {
  db.query('SELECT * FROM tables WHERE id = ?', [id], callback);
};

const addTable = (name, image_url, qr_url, callback) => {
  const query = 'INSERT INTO tables (name, image_url, qr_url) VALUES (?, ?, ?)';
  db.query(query, [name, image_url, qr_url], callback);
};

const updateTableQrUrl = (id, qr_url, callback) => {
  const query = 'UPDATE tables SET qr_url = ? WHERE id = ?';
  db.query(query, [qr_url, id], callback);
};

const updateTable = (id, name, image_url, callback) => {
  const query = 'UPDATE tables SET name = ?, image_url = ? WHERE id = ?';
  db.query(query, [name, image_url, id], callback);
};

const deleteTable = (id, callback) => {
  db.query('DELETE FROM tables WHERE id = ?', [id], callback);
};

module.exports = {
  getAllTables,
  getTableById,
  addTable,
  updateTable,
  deleteTable,
  updateTableQrUrl,
};
