const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mojen Retreat API is healthy',
  });
});

router.get('/db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS result');

    res.json({
      status: 'OK',
      message: 'Database connection is working',
      data: rows,
    });
  } catch (error) {
    console.error('Database connection error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
    });
  }
});

module.exports = router;