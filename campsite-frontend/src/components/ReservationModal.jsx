import { useState } from 'react';
import './ReservationModal.css';

const siteData = {
  Camping: [
    {
      id: 'C1',
      area: 'Pine forest',
      type: 'Tent Site',
      capacity: 2,
      price: 290000,
    },
    {
      id: 'C2',
      area: 'Pine forest',
      type: 'Tent Site',
      capacity: 2,
      price: 290000,
    },
    {
      id: 'C3',
      area: 'Lakeside',
      type: 'Tent Site',
      capacity: 2,
      price: 320000,
    },
    {
      id: 'C4',
      area: 'Lakeside',
      type: 'Tent Site',
      capacity: 4,
      price: 350000,
    },
  ],

  Glamping: [
    {
      id: 'G1',
      area: 'Streamside',
      type: 'Glamping Tent',
      capacity: 2,
      price: 790000,
    },
    {
      id: 'G2',
      area: 'Streamside',
      type: 'Glamping Tent',
      capacity: 2,
      price: 790000,
    },
    {
      id: 'G3',
      area: 'Pine forest',
      type: 'Glamping Tent',
      capacity: 4,
      price: 950000,
    },
  ],

  Lodge: [
    {
      id: 'L1',
      area: 'Garden area',
      type: 'Family Lodge',
      capacity: 8,
      price: 1190000,
    },
    {
      id: 'L2',
      area: 'Garden area',
      type: 'Family Lodge',
      capacity: 8,
      price: 1190000,
    },
  ],

  RV: [
    {
      id: 'RV1',
      area: 'Lakeside',
      type: 'Camper Van',
      capacity: 2,
      price: 950000,
    },
    {
      id: 'RV2',
      area: 'Lakeside',
      type: 'Camper Van',
      capacity: 2,
      price: 950000,
    },
  ],
};

const ReservationModal = ({ room, onClose }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const sites = siteData[room.type] || [];

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

    const bookingData = {
      room,
      site: selectedSite,
      customer: {
        fullName,
        phone,
        email,
      },
    };

    console.log('Booking information:', bookingData);

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