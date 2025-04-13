const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'college-management-secret',
  resave: false,
  saveUninitialized: true
}));

// Database setup
const db = require('./src/models/db');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./src/routes/authRoutes'));
app.use('/admin', require('./src/routes/adminRoutes'));
app.use('/staff', require('./src/routes/staffRoutes'));
app.use('/student', require('./src/routes/studentRoutes'));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
