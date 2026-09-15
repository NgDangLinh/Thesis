import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [payment, setPayment] = useState(
    location.state?.payment || null
  );

  const bookingId = new URLSearchParams(
    location.search
  ).get('bookingId');

 useEffect(() => {
  const loadPayment = async () => {
    if (payment) {
      return;
    }

    if (!bookingId) {
      navigate('/booking', { replace: true });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/payments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: Number(bookingId),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== 'OK') {
        throw new Error(
          result.message || 'Failed to load payment'
        );
      }

      setPayment(result.data);
    } catch (error) {
      console.error('Load payment error:', error);
      alert(error.message);
      navigate('/booking', { replace: true });
    }
  };

  loadPayment();
}, [payment, bookingId, navigate]);

useEffect(() => {
  if (!payment) {
    return;
  }

  if (formRef.current) {
    formRef.current.submit();
  }
}, [payment]);

  if (!payment) {
    return null;
  }

  return (
    <main className="payment-page">
      <section className="payment-card">
        <p className="payment-kicker">Secure payment</p>

        <h1>Complete your payment</h1>

        <p className="payment-description">
          You will be redirected to SePay to complete your payment.
        </p>

        <div className="payment-info">
          <div>
            <span>Payment code</span>
            <strong>{payment.paymentCode}</strong>
          </div>

          <div>
            <span>Amount</span>
            <strong>
              {Number(payment.amount).toLocaleString()} VND
            </strong>
          </div>
        </div>

        <form
          ref={formRef}
          action={payment.checkoutUrl}
          method="POST"
        >
          {Object.entries(payment.paymentFields).map(
            ([field, value]) => (
              <input
                key={field}
                type="hidden"
                name={field}
                value={value ?? ''}
              />
            )
          )}

          <button type="submit" className="payment-submit">
            Continue to payment
          </button>
        </form>

        <button
          type="button"
          className="payment-back"
          onClick={() => navigate('/booking')}
        >
          Back to booking
        </button>
      </section>
    </main>
  );
};

export default PaymentPage;