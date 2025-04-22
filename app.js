const express = require('express');
const db = require('./models/db');
const app = express();
const apiRoutes = require('./routes/api'); 
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));

app.use('/api', apiRoutes);
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
