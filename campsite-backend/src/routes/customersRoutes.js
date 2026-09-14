const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const {
  getCustomers,
} = require('../controllers/customersController');

router.get('/', authenticateToken, getCustomers);

module.exports = router;