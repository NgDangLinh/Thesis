const { SePayPgClient } = require('sepay-pg-node');

const sepayClient = new SePayPgClient({
  env: process.env.SEPAY_ENV || 'sandbox',
  merchant_id: process.env.SEPAY_MERCHANT_ID,
  secret_key: process.env.SEPAY_SECRET_KEY,
});

const createPaymentFields = ({
  bookingId,
  amount,
  successUrl,
  errorUrl,
  cancelUrl,
}) => {
  const checkoutUrl = sepayClient.checkout.initCheckoutUrl();

  const paymentFields =
    sepayClient.checkout.initOneTimePaymentFields({
      operation: 'PURCHASE',
      payment_method: 'BANK_TRANSFER',
      order_invoice_number: `MOJEN-${bookingId}`,
      order_amount: Number(amount),
      currency: 'VND',
      order_description: `Mojen Retreat booking ${bookingId}`,
      success_url: successUrl,
      error_url: errorUrl,
      cancel_url: cancelUrl,
    });

  return {
    checkoutUrl,
    paymentFields,
  };
};

module.exports = {
  createPaymentFields,
};