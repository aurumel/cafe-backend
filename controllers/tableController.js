const fs = require('fs');
const path = require('path');
const tableModel = require('../models/tableModel');
const QRCode = require("qrcode");

const getTables = (req, res) => {
  tableModel.getAllTables((err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching tables' });
    res.json(results);
  });
};

const getTableById = (req, res) => {
  const id = req.params.id;
  tableModel.getTableById(id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching table' });
    if (results.length === 0) return res.status(404).json({ error: 'table not found' });
    res.json(results[0]);
  });
};

const addTable = (req, res) => {
  const { name } = req.body;
  const image_url = req.file ? `/uploads/images/${req.file.filename}` : null;

  if (!name || !image_url) {
    return res.status(400).json({ error: 'Please provide name and image' });
  }

  tableModel.addTable(name, image_url, null, async (err, result) => {
    if (err) {
      console.error(err); // Tambahkan ini
      return res.status(500).json({ error: 'Error adding table' });
    }
    

    const tableId = result.insertId;
    const tableUrl = `https://namadomain.com/order/?table=${tableId}`;
    const qrDir = path.join(__dirname, '../public/qrcodes');

    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const qrFilename = `table_${tableId}_qr.png`;
    const qrPath = path.join(qrDir, qrFilename);

    try {
      await QRCode.toFile(qrPath, tableUrl);
      const qr_url = `/qrcodes/${qrFilename}`;

      // update kolom qr_url di database
      tableModel.updateTableQrUrl(tableId, qr_url, (updateErr) => {
        if (updateErr) {
          console.error('Failed to update QR URL:', updateErr);
          return res.status(500).json({ error: 'Failed to update QR code URL' });
        }

        res.status(201).json({
          message: 'Table added successfully',
          table: {
            id: tableId,
            name,
            image_url,
            qr_url,
          },
        });
      });
    } catch (qrErr) {
      console.error('Error generating QR code:', qrErr);
      res.status(500).json({ error: 'Error generating QR code' });
    }
  });
};

const updateTable = (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const image_url = req.file ? `/uploads/images/${req.file.filename}` : req.body.old_image;

  if (!name || !image_url) {
    return res.status(400).json({ error: 'Please provide name, image' });
  }

  tableModel.updateTable(id, name, image_url, (err) => {
    if (err) return res.status(500).json({ error: 'Error updating table' });
    res.json({ message: 'Table updated successfully' });
  });
};

const deleteTable = (req, res) => {
  const id = req.params.id;

  // Ambil data dulu buat hapus file
  tableModel.getTableById(id, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const imagePath = path.join(__dirname, '..', results[0].image_url);
    fs.unlink(imagePath, (err) => {
      if (err) console.log('Gagal hapus gambar:', err.message);
    });

    tableModel.deleteTable(id, (err) => {
      if (err) return res.status(500).json({ error: 'Error deleting table' });
      res.json({ message: 'Table deleted successfully' });
    });
  });
};

module.exports = {
    getTables,
    getTableById,
    addTable,
    updateTable,
    deleteTable
  };
  