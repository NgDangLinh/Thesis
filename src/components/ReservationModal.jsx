import { useState } from 'react';
import './ReservationModal.css';

const siteData = {
  Camping: [
    {
      id: 'C1',
      area: 'Rừng thông',
      type: 'Tent Site',
      capacity: 2,
      price: 290000,
    },
    {
      id: 'C2',
      area: 'Rừng thông',
      type: 'Tent Site',
      capacity: 2,
      price: 290000,
    },
    {
      id: 'C3',
      area: 'Ven hồ',
      type: 'Tent Site',
      capacity: 2,
      price: 320000,
    },
    {
      id: 'C4',
      area: 'Ven hồ',
      type: 'Tent Site',
      capacity: 4,
      price: 350000,
    },
  ],

  Glamping: [
    {
      id: 'G1',
      area: 'Ven suối',
      type: 'Glamping Tent',
      capacity: 2,
      price: 790000,
    },
    {
      id: 'G2',
      area: 'Ven suối',
      type: 'Glamping Tent',
      capacity: 2,
      price: 790000,
    },
    {
      id: 'G3',
      area: 'Rừng thông',
      type: 'Glamping Tent',
      capacity: 4,
      price: 950000,
    },
  ],

  Lodge: [
    {
      id: 'L1',
      area: 'Khu vườn',
      type: 'Family Lodge',
      capacity: 8,
      price: 1190000,
    },
    {
      id: 'L2',
      area: 'Khu vườn',
      type: 'Family Lodge',
      capacity: 8,
      price: 1190000,
    },
  ],

  RV: [
    {
      id: 'RV1',
      area: 'Ven hồ',
      type: 'Camper Van',
      capacity: 2,
      price: 950000,
    },
    {
      id: 'RV2',
      area: 'Ven hồ',
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

  // Dữ liệu demo các lô trại
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSite) {
      alert('Vui lòng chọn một lô trại.');
      return;
    }

    if (!fullName.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }

    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại.');
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

    alert('Yêu cầu đặt chỗ đã được gửi!');

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
              Chọn lô trại phù hợp và điền thông tin của bạn.
            </p>
          </div>

          <button
            className="reservation-close"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="reservation-section">
            <div className="reservation-section-title">
              <h3>Chọn lô trại còn trống</h3>
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
                        {site.type} · tối đa {site.capacity} khách · 1 đêm
                      </span>
                    </div>

                    <strong className="reservation-site-price">
                      {site.price.toLocaleString()}đ
                    </strong>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="reservation-section">
            <h3 className="reservation-customer-title">
              Thông tin khách hàng
            </h3>

            <div className="reservation-form-grid">
              <label>
                <span>Họ và tên</span>

                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>

              <label>
                <span>Số điện thoại</span>

                <input
                  type="tel"
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <label className="reservation-email">
                <span>Email (không bắt buộc)</span>

                <input
                  type="email"
                  placeholder="ban@email.com"
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
                {selectedSite.price.toLocaleString()}đ / đêm
              </strong>
            </div>
          )}

          <button className="reservation-submit" type="submit">
            Gửi yêu cầu đặt chỗ
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;