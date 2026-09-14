import { useState } from 'react';
import './ReservationModal.css';



const ReservationModal = ({
  room,
  checkIn,
  checkOut,
  guests,
  availableSites = [],
  onClose,
}) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const sites = availableSites;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSite) {
      alert('Please select a campsite.');
      return;
    }

    if (!fullName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }

  const savedBookings = localStorage.getItem('bookings');

const existingBookings = savedBookings
  ? JSON.parse(savedBookings)
  : [];

const newBooking = {
  id: `BK${String(existingBookings.length + 1).padStart(3, '0')}`,

  customerName: fullName.trim(),
  phone: phone.trim(),
  email: email.trim(),

  site: selectedSite.id,
  area: room.type,

  checkIn,
  checkOut,
  guests:
    guests === '4+ guests'
      ? 4
      : Number.parseInt(guests, 10),

  status: 'booked',

  totalAmount: selectedSite.price,
};

const updatedBookings = [
  ...existingBookings,
  newBooking,
];

localStorage.setItem(
  'bookings',
  JSON.stringify(updatedBookings)
);

window.dispatchEvent(
  new Event('bookingsUpdated')
);

console.log('Booking created:', newBooking);

alert('Your reservation request has been submitted!');
  

onClose();
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
    <strong>Check-in:</strong> {checkIn}
  </span>

  <span>
    <strong>Check-out:</strong> {checkOut}
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
                    className={`reservation-site ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedSite(site)}
                  >
                    <div className="reservation-site-info">
                      <strong>
                        {site.id} · {site.area}
                      </strong>

                      <span>
                        {site.type} · up to {site.capacity} guests · 1 night
                      </span>
                    </div>

                    <strong className="reservation-site-price">
                      {site.price.toLocaleString()} VND
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
                {selectedSite.id} · {selectedSite.area}
              </span>

              <strong>
                {selectedSite.price.toLocaleString()} VND / night
              </strong>
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