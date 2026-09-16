const db = require('../config/db');
const {
  createPaymentFields,
} = require('../services/paymentService');

const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'bookingId is required',
      });
    }

    const [bookings] = await db.query(
      `
      SELECT
        id,
        total_amount,
        status
      FROM bookings
      WHERE id = ?
      `,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Booking not found',
      });
    }

    const booking = bookings[0];

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Cannot create payment for a cancelled booking',
      });
    }

    const amount = Number(booking.total_amount);

    const paymentCode = `MOJEN-${booking.id}`;

    const [existingPayments] = await db.query(
      `
      SELECT
        id,
        payment_code,
        amount,
        status
      FROM payments
      WHERE booking_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [booking.id]
    );

    if (existingPayments.length > 0) {
  const existingPayment = existingPayments[0];

  const payment = createPaymentFields({
    bookingId: booking.id,
    amount: Number(existingPayment.amount),
    successUrl: 'https://mojen-retreat.n1.tinhgon.xyz/payment/success',
errorUrl: 'https://mojen-retreat.n1.tinhgon.xyz/payment/error',
cancelUrl: 'https://mojen-retreat.n1.tinhgon.xyz/payment/cancel',
  });

  return res.json({
    status: 'OK',
    message: 'Payment already exists',
    data: {
      ...existingPayment,
      checkoutUrl: payment.checkoutUrl,
      paymentFields: payment.paymentFields,
    },
  });
}

    const [paymentResult] = await db.query(
      `
      INSERT INTO payments (
        booking_id,
        payment_code,
        amount,
        status
      )
      VALUES (?, ?, ?, 'pending')
      `,
      [booking.id, paymentCode, amount]
    );

    const payment = createPaymentFields({
      bookingId: booking.id,
      amount,
      successUrl: 'https://mojen-retreat.n1.tinhgon.xyz/payment/success',
errorUrl: 'https://mojen-retreat.n1.tinhgon.xyz/payment/error',
cancelUrl: 'https://mojen-retreat.n1.tinhgon.xyz/payment/cancel',
    });

    return res.status(201).json({
      status: 'OK',
      message: 'Payment created successfully',
      data: {
        paymentId: paymentResult.insertId,
        bookingId: booking.id,
        paymentCode,
        amount,
        checkoutUrl: payment.checkoutUrl,
        paymentFields: payment.paymentFields,
      },
    });
  } catch (error) {
    console.error('Create payment error:', error);

    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create payment',
    });
  }
};

const handlePaymentIPN = async (req, res) => {
  try {
    const data = req.body;

    console.log('SePay IPN received:', data);

    if (data.notification_type !== 'ORDER_PAID') {
      return res.status(200).json({
        status: 'OK',
        message: 'IPN received',
      });
    }

    const order = data.order;
    const transaction = data.transaction;

    if (!order || !transaction) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid IPN data',
      });
    }

    const paymentCode = order.order_invoice_number;
    const transactionId = transaction.transaction_id;
    const transactionAmount = Number(
      transaction.transaction_amount
    );

    const [payments] = await db.query(
      `
      SELECT
        id,
        booking_id,
        amount,
        status
      FROM payments
      WHERE payment_code = ?
      LIMIT 1
      `,
      [paymentCode]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Payment not found',
      });
    }

    const payment = payments[0];

    if (payment.status === 'paid') {
      return res.status(200).json({
        status: 'OK',
        message: 'Payment already paid',
      });
    }

    if (transactionAmount !== Number(payment.amount)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Payment amount does not match',
      });
    }

    await db.query(
      `
      UPDATE payments
      SET
        status = 'paid',
        transaction_id = ?,
        paid_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [transactionId, payment.id]
    );

    return res.status(200).json({
      status: 'OK',
      message: 'Payment marked as paid',
    });
  } catch (error) {
    console.error('Payment IPN error:', error);

    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to process payment IPN',
    });
  }
};

const getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'bookingId is required',
      });
    }

    const [payments] = await db.query(
      `
      SELECT
        id,
        booking_id,
        payment_code,
        amount,
        status,
        transaction_id,
        paid_at
      FROM payments
      WHERE booking_id = ?
      LIMIT 1
      `,
      [bookingId]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Payment not found',
      });
    }

    return res.json({
      status: 'OK',
      data: payments[0],
    });
  } catch (error) {
    console.error('Get payment error:', error);

    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to get payment',
    });
  }
};

module.exports = {
  createPayment,
  handlePaymentIPN,
  getPaymentByBookingId,
};