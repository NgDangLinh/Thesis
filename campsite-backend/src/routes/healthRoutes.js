const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mojen Retreat API is healthy',
  });
});

module.exports = router;