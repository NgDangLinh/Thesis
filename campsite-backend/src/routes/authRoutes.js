const express = require('express');
const router = express.Router();

const {
  login,
} = require('../controllers/authController');

const authenticateToken = require('../middleware/authMiddleware');

router.post('/login', login);

router.get('/test', authenticateToken, (req, res) => {
  res.json({
    status: 'OK',
    message: 'Protected route is working',
    user: req.user,
  });
});

module.exports = router;