const orderModel = require('../models/orderModel');

const getOrderDetails = (req, res) => {
  const orderId = req.params.id;

  orderModel.getOrderWithItems(orderId, (err, order) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch order data' });
    }

    res.json(order);
  });
};

const deleteOrder = (req, res) => {
  const orderId = req.params.id;

  orderModel.deleteOrder(orderId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete order' });
    }

    res.json({ message: 'Order deleted successfully' });
  });
};

const updateOrderItem = (req, res) => {
  const itemId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be a positive number' });
  }

  orderModel.updateOrderItemQuantity(itemId, quantity, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order item' });
    }

    res.json({ message: 'Order item updated successfully' });
  });
};

const deleteOrderItem = (req, res) => {
  const itemId = req.params.id;

  orderModel.deleteOrderItem(itemId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete order item' });
    }

    res.json({ message: 'Order item deleted successfully' });
  });
};

const addOrder = (req, res) => {
  const { id_table, items } = req.body;
  const status = 'proses';
  const order_time = new Date();

  // Buat order baru
  orderModel.createOrder(id_table, status, order_time, (err, orderId) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal menambahkan order' });
    }

    // Proses item satu per satu
    let processed = 0;
    const totalItems = items.length;

    items.forEach((item) => {
      orderModel.getProductPrice(item.id_product, (err, price) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Gagal mendapatkan harga produk' });
        }

        const subtotal = price * item.quantity;

        orderModel.createOrderItem(orderId, item.id_product, item.quantity, subtotal, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Gagal menambahkan item order' });
          }

          processed++;
          if (processed === totalItems) {
            res.status(201).json({ message: 'Order berhasil ditambahkan', order_id: orderId });
          }
        });
      });
    });
  });
};

module.exports = {
  getOrderDetails,
  deleteOrder,
  updateOrderItem,
  deleteOrderItem,
  addOrder,
};
