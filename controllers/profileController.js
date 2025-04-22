const fs = require('fs');
const path = require('path');
const profileModel = require('../models/profileModel');

const getProfile = (req, res) => {
  profileModel.getProfile((err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching profile' });
    res.json(results);
  });
};

const updateProfile = (req, res) => {
    const { name } = req.body;
    const image_url = req.file ? `/uploads/images/${req.file.filename}` : req.body.old_image;
  
    if (!name || !image_url) {
      return res.status(400).json({ error: 'Please provide name, image' });
    }
  
    profileModel.updateProfile(name, image_url, (err) => {
      if (err) return res.status(500).json({ error: 'Error updating profile' });
      res.json({ message: 'Profile updated successfully' });
    });
  };

module.exports = {
    getProfile,
    updateProfile
  };
  