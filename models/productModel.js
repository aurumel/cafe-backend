const db = require('./db');

const getAllProducts = (callback) => {
  db.query('SELECT * FROM products', callback);
};

const getProductById = (id, callback) => {
  db.query('SELECT * FROM products WHERE id = ?', [id], callback);
};

const addProduct = (name, price, image_url, status, callback) => {
  const query = 'INSERT INTO products (name, price, image_url, status) VALUES (?, ?, ?, ?)';
  db.query(query, [name, price, image_url, status], callback);
};

const updateProduct = (id, name, price, image_url, status, callback) => {
  const query = 'UPDATE products SET name = ?, price = ?, image_url = ?, status = ? WHERE id = ?';
  db.query(query, [name, price, image_url, status, id], callback);
};

const deleteProduct = (id, callback) => {
  db.query('DELETE FROM products WHERE id = ?', [id], callback);
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
