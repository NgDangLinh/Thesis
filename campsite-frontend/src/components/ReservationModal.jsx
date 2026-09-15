import { useState } from 'react';
import './ReservationModal.css';
import { useNavigate } from 'react-router-dom';


const ReservationModal = ({
  room,
  checkIn,
  checkOut,
  guests,
  availableSites = [],
  onClose,
}) => {
  const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const sites = availableSites;

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    const [year, month, day] = dateString.split('-');

    return `${day}/${month}/${year}`;
  };

  const getNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    return Math.round(
      (end - start) / (1000 * 60 * 60 * 24)
    );
  };

  const nights = getNights();

  const guestCount =
  guests === '4+ guests'
    ? 4
    : Number.parseInt(guests, 10);

const totalAmount =
  selectedSite && nights > 0
    ? selectedSite.price * guestCount * nights
    : 0;

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!fullName.trim()) {
    alert('Please enter your full name.');
    return;
  }

  if (!phone.trim()) {
    alert('Please enter your phone number.');
    return;
  }

  if (!selectedSite) {
    alert('Please select a site.');
    return;
  }

  try {
    // Step 1: Create booking
    const bookingResponse = await fetch(
      'http://localhost:5000/api/bookings',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          siteId: selectedSite.id,
          checkIn,
          checkOut,
          guests:
            guests === '4+ guests'
              ? 4
              : Number.parseInt(guests, 10),
        }),
      }
    );

    const bookingResult = await bookingResponse.json();

    if (!bookingResponse.ok) {
      alert(
        bookingResult.message ||
          'Failed to create reservation.'
      );
      return;
    }

    const booking = bookingResult.data;

    // Step 2: Create payment
    const paymentResponse = await fetch(
      'http://localhost:5000/api/payments',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
        }),
      }
    );

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok) {
      alert(
        paymentResult.message ||
          'Failed to create payment.'
      );
      return;
    }

    // Step 3: Go to payment page
    onClose();

    navigate('/payment', {
      state: {
        payment: paymentResult.data,
      },
    });
  } catch (error) {
    console.error('Reservation error:', error);
    alert('Cannot connect to server.');
  }
};


  if (!room) {
    return null;
  }

  return (
    <div className="reservation-overlay" onMouseDown={onClose}>
      <div
        className="reservation-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="reservation-header">
          <div>
            <p className="reservation-kicker">Reservation</p>

            <h2>{room.name}</h2>

            <p className="reservation-description">
              Select a suitable campsite and enter your details.
            </p>
            <div className="reservation-dates">
              <span>
                <strong>Check-in:</strong> {formatDate(checkIn)}
              </span>

              <span>
                <strong>Check-out:</strong> {formatDate(checkOut)}
              </span>

              <span>
                <strong>Guests:</strong> {guests}
              </span>
            </div>
          </div>

          <button
            className="reservation-close"
            type="button"
            onClick={onClose}
            aria-label="Close reservation"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="reservation-section">
            <div className="reservation-section-title">
              <h3>Available campsites</h3>
              <span>({sites.length})</span>
            </div>

            <div className="reservation-sites">
              {sites.map((site) => {
                const isSelected = selectedSite?.id === site.id;

                return (
                  <button
                    key={site.id}
                    type="button"
                    className={`reservation-site ${isSelected ? 'selected' : ''
                      }`}
                    onClick={() => setSelectedSite(site)}
                  >
                    <div className="reservation-site-info">
                      <strong>
                        {site.id} — {site.category} Site
                      </strong>

                      <span>
                        {site.category === 'Camping'
                          ? 'Tent'
                          : site.category === 'Glamping'
                            ? 'Glamping Tent'
                            : site.type}
                        {' · '}
                        up to {site.capacity} guests · {nights} {nights === 1 ? 'night' : 'nights'}
                      </span>
                    </div>

                    <strong className="reservation-site-price">
  {site.price.toLocaleString()} VND / person / night
</strong>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="reservation-section">
            <h3 className="reservation-customer-title">
              Guest information
            </h3>

            <div className="reservation-form-grid">
              <label>
                <span>Full name</span>

                <input
                  type="text"
                  placeholder="Nguyen Van A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>

              <label>
                <span>Phone number</span>

                <input
                  type="tel"
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <label className="reservation-email">
                <span>Email (optional)</span>

                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
          </section>

          {selectedSite && (
  <div className="reservation-summary">
    <span>
      {selectedSite.id} — {selectedSite.category} Site
    </span>

    <div>
      <span>
        {selectedSite.price.toLocaleString()} VND × {guestCount}{' '}
        guests × {nights} {nights === 1 ? 'night' : 'nights'}
      </span>

      <strong>
        Total: {totalAmount.toLocaleString()} VND
      </strong>
    </div>
  </div>
)}

          <button className="reservation-submit" type="submit">
            Submit reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;