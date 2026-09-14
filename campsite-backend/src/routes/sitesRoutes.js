const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const {
  getSites,
  getSiteById,
  getAvailableSites,
} = require('../controllers/sitesController');

router.get('/availability', getAvailableSites);
router.get('/', authenticateToken, getSites);
router.get('/:id', authenticateToken, getSiteById);

module.exports = router;