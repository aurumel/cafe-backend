const fs = require('fs');
const path = require('path');
const productModel = require('../models/productModel');

const getProducts = (req, res) => {
  productModel.getAllProducts((err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching products' });
    res.json(results);
  });
};

const getProductById = (req, res) => {
  const id = req.params.id;
  productModel.getProductById(id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching product' });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
};

const addProduct = (req, res) => {
  const { name, price, status } = req.body;
  const image_url = req.file ? `/uploads/images/${req.file.filename}` : null;

  if (!name || !price || !status || !image_url) {
    return res.status(400).json({ error: 'Please provide name, price, image, and status' });
  }

  productModel.addProduct(name, price, image_url, status, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error adding product' });

    res.status(201).json({
      message: 'Product added successfully',
      product: { id: result.insertId, name, price, image_url, status },
    });
  });
};

const updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, price, status } = req.body;
  const image_url = req.file ? `/uploads/images/${req.file.filename}` : req.body.old_image;

  if (!name || !price || !status || !image_url) {
    return res.status(400).json({ error: 'Please provide name, price, image, and status' });
  }

  productModel.updateProduct(id, name, price, image_url, status, (err) => {
    if (err) return res.status(500).json({ error: 'Error updating product' });
    res.json({ message: 'Product updated successfully' });
  });
};

const deleteProduct = (req, res) => {
  const id = req.params.id;

  // Ambil data dulu buat hapus file
  productModel.getProductById(id, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagePath = path.join(__dirname, '..', results[0].image_url);
    fs.unlink(imagePath, (err) => {
      if (err) console.log('Gagal hapus gambar:', err.message);
    });

    productModel.deleteProduct(id, (err) => {
      if (err) return res.status(500).json({ error: 'Error deleting product' });
      res.json({ message: 'Product deleted successfully' });
    });
  });
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
