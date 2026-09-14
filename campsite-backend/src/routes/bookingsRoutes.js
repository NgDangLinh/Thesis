const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
} = require('../controllers/bookingsController');

router.post('/', createBooking);
router.get('/', authenticateToken, getBookings);
router.get('/:id', authenticateToken, getBookingById);
router.put('/:id', authenticateToken, updateBooking);
router.patch('/:id/cancel', authenticateToken, cancelBooking);

module.exports = router;