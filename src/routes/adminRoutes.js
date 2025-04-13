const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Get all users
router.get('/users', isAdmin, (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new user
router.post('/users', isAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role],
      function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all courses
router.get('/courses', isAdmin, (req, res) => {
  db.all('SELECT * FROM courses', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new course
router.post('/courses', isAdmin, (req, res) => {
  const { course_code, course_name, credits } = req.body;
  
  db.run(
    'INSERT INTO courses (course_code, course_name, credits) VALUES (?, ?, ?)',
    [course_code, course_name, credits],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
