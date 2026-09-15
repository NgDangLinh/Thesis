import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentResultPage.css';

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.pathname.split('/').pop();

  const result = {
    success: {
      title: 'Payment successful',
      message:
        'Your payment has been completed successfully. Thank you for choosing Mojen Retreat.',
      button: 'Back to Home',
    },
    error: {
      title: 'Payment failed',
      message:
        'Your payment could not be completed. Please try again.',
      button: 'Back to Booking',
    },
    cancel: {
      title: 'Payment cancelled',
      message:
        'Your payment was cancelled. You can return to booking and try again.',
      button: 'Back to Booking',
    },
  };

  const currentResult = result[type] || result.success;

  const handleClick = () => {
    if (type === 'success') {
      navigate('/');
    } else {
      navigate('/booking');
    }
  };

  return (
    <main className="payment-result-page">
      <section className="payment-result-card">
        <div className="payment-result-icon">
          {type === 'success' ? '✓' : '×'}
        </div>

        <p className="payment-result-kicker">
          {type === 'success' ? 'Payment complete' : 'Payment status'}
        </p>

        <h1>{currentResult.title}</h1>

        <p>{currentResult.message}</p>

        <button
          type="button"
          className="payment-result-button"
          onClick={handleClick}
        >
          {currentResult.button}
        </button>
      </section>
    </main>
  );
};

export default PaymentResultPage;