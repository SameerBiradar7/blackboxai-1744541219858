const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Middleware to check staff role
const isStaff = (req, res, next) => {
  if (req.session.user?.role !== 'staff') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Get all grades for a specific student
router.get('/grades/:studentId', isStaff, (req, res) => {
  const { studentId } = req.params;
  
  db.all('SELECT * FROM grades WHERE student_id = ?', [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Enter grade for a specific student
router.post('/grades', isStaff, (req, res) => {
  const { student_id, course_id, grade } = req.body;
  
  db.run(
    'INSERT INTO grades (student_id, course_id, grade) VALUES (?, ?, ?)',
    [student_id, course_id, grade],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Get courses assigned to staff
router.get('/my-courses', isStaff, (req, res) => {
  const staffId = req.session.user.id; // Assuming staff ID is stored in session
  db.all('SELECT * FROM courses WHERE staff_id = ?', [staffId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
