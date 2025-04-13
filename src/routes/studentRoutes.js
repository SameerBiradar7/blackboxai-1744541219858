const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Middleware to check student role
const isStudent = (req, res, next) => {
  if (req.session.user?.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Get student's grades
router.get('/grades', isStudent, (req, res) => {
  const studentId = req.session.user.id; // Assuming student ID is stored in session
  db.all('SELECT * FROM grades WHERE student_id = ?', [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get enrolled courses
router.get('/courses', isStudent, (req, res) => {
  const studentId = req.session.user.id; // Assuming student ID is stored in session
  db.all('SELECT * FROM enrollment WHERE student_id = ?', [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Enroll in a course
router.post('/enroll', isStudent, (req, res) => {
  const { course_id } = req.body;
  const studentId = req.session.user.id; // Assuming student ID is stored in session
  
  db.run(
    'INSERT INTO enrollment (student_id, course_id) VALUES (?, ?)',
    [studentId, course_id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
