const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/db');

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    res.json({ 
      message: 'Login successful',
      user: req.session.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Check session route
router.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'No active session' });
  }
});

module.exports = router;
