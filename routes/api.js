const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const tableController = require('../controllers/tableController');
const profileController = require('../controllers/profileController');
const orderController = require('../controllers/orderController');
const upload = require('../middlewares/upload');

// Product
router.get('/products', productController.getProducts);
router.get('/product/:id', productController.getProductById);
router.post('/add-products', upload.single('image'), productController.addProduct);
router.put('/update-product/:id', upload.single('image'), productController.updateProduct);
router.delete('/delete-product/:id', productController.deleteProduct);

// Table
router.get('/tables', tableController.getTables);
router.get('/table/:id', tableController.getTableById);
router.post('/add-table', upload.single('image'), tableController.addTable);
router.put('/update-table/:id', upload.single('image'), tableController.updateTable);
router.delete('/delete-table/:id', tableController.deleteTable);

// Profile
router.get('/profile', profileController.getProfile);
router.put('/update-profile', upload.single('image'), profileController.updateProfile);

// Order
router.get('/orders/:id', orderController.getOrderDetails);
router.delete('/orders/:id', orderController.deleteOrder);
router.put('/order-items/:id', upload.none(), orderController.updateOrderItem);
router.delete('/order-items/:id', orderController.deleteOrderItem);
router.post('/add-order', orderController.addOrder);

module.exports = router;