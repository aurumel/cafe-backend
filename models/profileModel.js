const db = require('./db');

const getProfile = (callback) => {
    db.query('SELECT * FROM profiles WHERE id=1', callback);
  };

const updateProfile = (name, image_url, callback) => {
    const query = 'UPDATE profiles SET name = ?, image_url = ? WHERE id = 1';
    db.query(query, [name, image_url], callback);
  };
  

module.exports = {
    getProfile,
    updateProfile
  };