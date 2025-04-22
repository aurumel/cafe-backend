const db = require('./db');

const getOrderWithItems = (orderId, callback) => {
  const orderQuery = 'SELECT * FROM orders WHERE id = ?';
  const itemsQuery = `
    SELECT 
      oi.id_product, p.name, p.price, oi.quantity, oi.subtotal
    FROM order_items oi
    JOIN products p ON oi.id_product = p.id
    WHERE oi.id_order = ?
  `;

  db.query(orderQuery, [orderId], (err, orderResults) => {
    if (err || orderResults.length === 0) {
      return callback(err || new Error('Order not found'), null);
    }

    const order = orderResults[0];

    db.query(itemsQuery, [orderId], (err, itemResults) => {
      if (err) return callback(err, null);

      order.items = itemResults;
      callback(null, order);
    });
  });
};

const deleteOrder = (orderId, callback) => {
  const deleteItemsQuery = 'DELETE FROM order_items WHERE id_order = ?';
  const deleteOrderQuery = 'DELETE FROM orders WHERE id = ?';

  db.query(deleteItemsQuery, [orderId], (err) => {
    if (err) return callback(err);

    db.query(deleteOrderQuery, [orderId], (err, result) => {
      if (err) return callback(err);

      callback(null, result);
    });
  });
};

const updateOrderItemQuantity = (itemId, quantity, callback) => {
  const getPriceQuery = `
    SELECT p.price
    FROM order_items oi
    JOIN products p ON oi.id_product = p.id
    WHERE oi.id = ?
  `;

  db.query(getPriceQuery, [itemId], (err, results) => {
    if (err) return callback(err);

    if (results.length === 0) {
      return callback(new Error('Order item not found'));
    }

    const price = results[0].price;
    const newSubtotal = price * quantity;

    const updateQuery = 'UPDATE order_items SET quantity = ?, subtotal = ? WHERE id = ?';
    db.query(updateQuery, [quantity, newSubtotal, itemId], (err, result) => {
      if (err) return callback(err);

      callback(null, result);
    });
  });
};

const deleteOrderItem = (id, callback) => {
  db.query('DELETE FROM order_items WHERE id = ?', [id], callback);
};

// ✅ Tambahan fungsi createOrder, createOrderItem, dan getProductPrice
const createOrder = (id_table, status, order_time, callback) => {
  const query = 'INSERT INTO orders (id_table, status, order_time) VALUES (?, ?, ?)';
  db.query(query, [id_table, status, order_time], (err, result) => {
    if (err) return callback(err);
    callback(null, result.insertId);
  });
};

const createOrderItem = (id_order, id_product, quantity, subtotal, callback) => {
  const query = 'INSERT INTO order_items (id_order, id_product, quantity, subtotal) VALUES (?, ?, ?, ?)';
  db.query(query, [id_order, id_product, quantity, subtotal], callback);
};

const getProductPrice = (id_product, callback) => {
  const query = 'SELECT price FROM products WHERE id = ?';
  db.query(query, [id_product], (err, results) => {
    if (err) return callback(err);
    const price = results[0]?.price || 0;
    callback(null, price);
  });
};

module.exports = {
  getOrderWithItems,
  deleteOrder,
  updateOrderItemQuantity,
  deleteOrderItem,
  createOrder,
  createOrderItem,
  getProductPrice,
};
