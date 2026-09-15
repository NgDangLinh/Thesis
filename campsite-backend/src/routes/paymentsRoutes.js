const express = require('express');
const router = express.Router();

const {
  createPayment,
  getPaymentByBookingId,
  handlePaymentIPN,
} = require('../controllers/paymentsController');

router.post('/', createPayment);
router.get('/booking/:bookingId', getPaymentByBookingId);
router.post('/ipn', handlePaymentIPN);

module.exports = router;