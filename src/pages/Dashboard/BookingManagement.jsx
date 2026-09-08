import React, { useEffect, useState } from 'react';
import './BookingManagement.css';

const bookingData = [
  {
    id: 'BK001',
    customerName: 'Bùi Anh Tuấn',
    phone: '0911 234 567',
    site: 'R1',
    area: 'Rừng thông',
    checkIn: '23/08/2026',
    checkOut: '25/08/2026',
    guests: 2,
    status: 'booked',
  },

  {
    id: 'BK002',
    customerName: 'Vũ Đức Nam',
    phone: '0966 777 333',
    site: 'H5',
    area: 'Ven hồ',
    checkIn: '21/08/2026',
    checkOut: '23/08/2026',
    guests: 4,
    status: 'booked',
  },

  {
    id: 'BK003',
    customerName: 'Lê Hoàng Long',
    phone: '0905 111 222',
    site: 'R2',
    area: 'Rừng thông',
    checkIn: '19/08/2026',
    checkOut: '22/08/2026',
    guests: 2,
    status: 'booked',
  },

  {
    id: 'BK004',
    customerName: 'Phạm Minh Khuê',
    phone: '0977 888 999',
    site: 'D3',
    area: 'Đồi cao',
    checkIn: '19/08/2026',
    checkOut: '21/08/2026',
    guests: 7,
    status: 'booked',
  },

  {
    id: 'BK005',
    customerName: 'Nguyễn Văn An',
    phone: '0912 345 678',
    site: 'H1',
    area: 'Ven hồ',
    checkIn: '18/08/2026',
    checkOut: '20/08/2026',
    guests: 3,
    status: 'checked-in',
  },

  {
    id: 'BK006',
    customerName: 'Trần Thị Bích',
    phone: '0987 654 321',
    site: 'H3',
    area: 'Ven hồ',
    checkIn: '17/08/2026',
    checkOut: '21/08/2026',
    guests: 5,
    status: 'checked-in',
  },

  {
    id: 'BK007',
    customerName: 'Đỗ Thu Hà',
    phone: '0933 222 111',
    site: 'R4',
    area: 'Rừng thông',
    checkIn: '14/08/2026',
    checkOut: '17/08/2026',
    guests: 4,
    status: 'checked-out',
  },

  {
    id: 'BK008',
    customerName: 'Ngô Thị Lan',
    phone: '0988 456 123',
    site: 'D1',
    area: 'Đồi cao',
    checkIn: '11/08/2026',
    checkOut: '13/08/2026',
    guests: 5,
    status: 'checked-out',
  },
];  

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState(() => {
  const savedBookings = localStorage.getItem('bookings');

  return savedBookings
    ? JSON.parse(savedBookings)
    : bookingData;
});


  const [editingBooking, setEditingBooking] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
  customerName: '',
  phone: '',
  category: 'Camping',
  site: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
});

const [siteStatuses, setSiteStatuses] = useState({});

useEffect(() => {
  localStorage.setItem(
    'bookings',
    JSON.stringify(bookings)
  );
}, [bookings]);

useEffect(() => {
  const loadSiteStatuses = () => {
    const savedSiteStatuses = localStorage.getItem('siteStatuses');

    if (savedSiteStatuses) {
      setSiteStatuses(JSON.parse(savedSiteStatuses));
    } else {
      setSiteStatuses({});
    }
  };

  // Load lần đầu
  loadSiteStatuses();

  // Lắng nghe thay đổi từ Site Map
  window.addEventListener('siteStatusesUpdated', loadSiteStatuses);

  return () => {
    window.removeEventListener(
      'siteStatusesUpdated',
      loadSiteStatuses
    );
  };
}, []);

    const handleCreateBooking = () => {
  if (!newBooking.customerName.trim()) {
    alert('Vui lòng nhập tên khách hàng.');
    return;
  }

  if (!newBooking.phone.trim()) {
    alert('Vui lòng nhập số điện thoại.');
    return;
  }

  if (!newBooking.site) {
    alert('Vui lòng chọn site.');
    return;
  }

  if (!newBooking.checkIn) {
    alert('Vui lòng chọn ngày check-in.');
    return;
  }

  if (!newBooking.checkOut) {
    alert('Vui lòng chọn ngày check-out.');
    return;
  }

  if (newBooking.checkOut <= newBooking.checkIn) {
    alert('Ngày check-out phải sau ngày check-in.');
    return;
  }

  const selectedSite = newBooking.site;

// Đọc trạng thái site mới nhất từ localStorage
const savedSiteStatuses = localStorage.getItem('siteStatuses');

const currentSiteStatuses = savedSiteStatuses
  ? JSON.parse(savedSiteStatuses)
  : {};

const currentSiteStatus = currentSiteStatuses[selectedSite];

// Kiểm tra site có đang bảo trì hay không
if (currentSiteStatus === 'maintenance') {
  alert(`${selectedSite} hiện đang bảo trì và không thể đặt.`);
  return;
}

const siteAlreadyBooked = bookings.some(
  (booking) =>
    booking.site === selectedSite &&
    booking.status !== 'checked-out' &&
    booking.status !== 'cancelled'
);

if (siteAlreadyBooked) {
  alert(`${selectedSite} hiện đang có booking.`);
  return;
}

  const newBookingItem = {
    id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
    customerName: newBooking.customerName.trim(),
    phone: newBooking.phone.trim(),
    site: newBooking.site,
    area: newBooking.category,
    checkIn: newBooking.checkIn,
    checkOut: newBooking.checkOut,
    guests: newBooking.guests,
    status: 'booked',
  };

  setBookings((currentBookings) => [
    ...currentBookings,
    newBookingItem,
  ]);

  setNewBooking({
    customerName: '',
    phone: '',
    category: 'Camping',
    site: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  setIsCreateModalOpen(false);
};


  const handleEditBooking = (booking) => {
  setEditingBooking(booking);
};

const handleSaveBooking = () => {
  if (!editingBooking) {
    return;
  };


  setBookings((currentBookings) =>
    currentBookings.map((booking) =>
      booking.id === editingBooking.id
        ? editingBooking
        : booking
    )
  );

  setEditingBooking(null);
};

  const handleDeleteBooking = (bookingId) => {
  const booking = bookings.find(
    (item) => item.id === bookingId
  );

  if (!booking) {
    return;
  }

  const confirmed = window.confirm(
    `Bạn có chắc muốn xóa đặt chỗ của ${booking.customerName}?`
  );

  if (!confirmed) {
    return;
  }

  setBookings((currentBookings) =>
    currentBookings.filter(
      (item) => item.id !== bookingId
    )
  );
};

  const filteredBookings = bookings.filter((booking) => {
  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    booking.customerName.toLowerCase().includes(search) ||
    booking.site.toLowerCase().includes(search);

  const matchesStatus =
    statusFilter === 'all' ||
    booking.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="booking-management-page">

      <div className="booking-management-header">

        <div className="booking-management-title">
          <p className="booking-management-kicker">
            SỔ ĐẶT CHỖ
          </p>

          <h1>Đặt chỗ</h1>

          <p className="booking-management-description">
            Theo dõi mọi lượt đặt, nhận và trả trại.
          </p>
        </div>

        <button
          type="button"
          className="booking-management-add-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <span>+</span>
          Đặt chỗ mới
        </button>

      </div>

      {/* SEARCH & FILTER */}

      <div className="booking-management-filters">

        <div className="booking-search">

          <span className="booking-search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Tìm theo tên khách hoặc mã lô..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        <select
          className="booking-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">
            Tất cả trạng thái
          </option>

          <option value="booked">
            Đã đặt
          </option>

          <option value="checked-in">
            Đang ở
          </option>

          <option value="checked-out">
            Đã trả
          </option>

          <option value="cancelled">
            Đã hủy
          </option>
        </select>

      </div>
      <div className="booking-table-card">

  <div className="booking-table-header">
    <div>KHÁCH</div>
    <div>LÔ</div>
    <div>NGÀY</div>
    <div>SỐ KHÁCH</div>
    <div>TRẠNG THÁI</div>
    <div></div>
  </div>

  {filteredBookings.length > 0 ? (
  filteredBookings.map((booking) => (
    <div
      className="booking-table-row"
      key={booking.id}
    >

      <div className="booking-customer">
        <strong>{booking.customerName}</strong>
        <span>{booking.phone}</span>
      </div>

      <div className="booking-site">
        <strong>{booking.site}</strong>
        <span>{booking.area}</span>
      </div>

      <div className="booking-date">
        <span>
          {booking.checkIn} → {booking.checkOut}
        </span>
      </div>

      <div className="booking-guests">
        {booking.guests}
      </div>

      <div className="booking-status">
        <span
          className={`booking-status-badge booking-status-badge--${booking.status}`}
        >
          <span className="booking-status-dot"></span>

          {booking.status === 'booked'
            ? 'Đã đặt'
            : booking.status === 'checked-in'
            ? 'Đang ở'
            : booking.status === 'checked-out'
            ? 'Đã trả'
            : 'Đã hủy'}
        </span>
      </div>

      <div className="booking-actions">
        <button
          type="button"
          className="booking-action-btn"
          onClick={() => handleEditBooking(booking)}
        >
          ✎
        </button>
        <button
           type="button"
           className="booking-action-btn"
           onClick={() => handleDeleteBooking(booking.id)}
        >
          🗑
        </button>
      </div>

    </div>
  ))
) : (
  <div className="booking-empty-state">
    <strong>Không tìm thấy đặt chỗ</strong>

    <span>
      Thử tìm bằng tên khách hoặc mã lô khác.
    </span>
  </div>
)}

</div>
  {editingBooking && (
  <div className="booking-modal-overlay">

    <div className="booking-modal">

      <div className="booking-modal-header">

        <div>
          <p className="booking-modal-kicker">
            CHỈNH SỬA
          </p>

          <h2>
            Đặt chỗ {editingBooking.id}
          </h2>
        </div>

        <button
          type="button"
          className="booking-modal-close"
          onClick={() => setEditingBooking(null)}
        >
          ×
        </button>

      </div>


      <div className="booking-modal-body">

        <div className="booking-form-field">
          <label>
            Tên khách hàng
          </label>

          <input
            type="text"
            value={editingBooking.customerName}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                customerName: e.target.value,
              })
            }
          />
        </div>


        <div className="booking-form-field">
          <label>
            Số điện thoại
          </label>

          <input
            type="text"
            value={editingBooking.phone}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                phone: e.target.value,
              })
            }
          />
        </div>


        <div className="booking-form-row">

          <div className="booking-form-field">
            <label>
              Mã lô
            </label>

            <input
              type="text"
              value={editingBooking.site}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  site: e.target.value,
                })
              }
            />
          </div>


          <div className="booking-form-field">
            <label>
              Khu vực
            </label>

            <input
              type="text"
              value={editingBooking.area}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  area: e.target.value,
                })
              }
            />
          </div>

        </div>


        <div className="booking-form-row">

          <div className="booking-form-field">
            <label>
              Check-in
            </label>

            <input
              type="text"
              value={editingBooking.checkIn}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  checkIn: e.target.value,
                })
              }
            />
          </div>


          <div className="booking-form-field">
            <label>
              Check-out
            </label>

            <input
              type="text"
              value={editingBooking.checkOut}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  checkOut: e.target.value,
                })
              }
            />
          </div>

        </div>


        <div className="booking-form-row">

          <div className="booking-form-field">
            <label>
              Số khách
            </label>

            <input
              type="number"
              min="1"
              value={editingBooking.guests}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  guests: Number(e.target.value),
                })
              }
            />
          </div>


          <div className="booking-form-field">

            <label>
              Trạng thái
            </label>

            <select
              value={editingBooking.status}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  status: e.target.value,
                })
              }
            >
              <option value="booked">
                Đã đặt
              </option>

              <option value="checked-in">
                Đang ở
              </option>

              <option value="checked-out">
                Đã trả
              </option>

              <option value="cancelled">
                Đã hủy
              </option>
            </select>

          </div>

        </div>

      </div>


      <div className="booking-modal-footer">

        <button
          type="button"
          className="booking-modal-cancel"
          onClick={() => setEditingBooking(null)}
        >
          Hủy
        </button>

        <button
          type="button"
          className="booking-modal-save"
          onClick={handleSaveBooking}
        >
          Lưu thay đổi
        </button>

      </div>

    </div>
  
  </div>
)}
  {isCreateModalOpen && (
  <div className="booking-modal-overlay">

    <div className="booking-modal">

      <div className="booking-modal-header">

        <div>
          <p className="booking-modal-kicker">
            ĐẶT CHỖ MỚI
          </p>

          <h2>
            Tạo đặt chỗ
          </h2>
        </div>

        <button
          type="button"
          className="booking-modal-close"
          onClick={() => setIsCreateModalOpen(false)}
        >
          ×
        </button>

      </div>


      <div className="booking-modal-body">

        <div className="booking-form-field">
          <label>
            Tên khách hàng
          </label>

          <input
            type="text"
            placeholder="Nhập tên khách hàng"
            value={newBooking.customerName}
            onChange={(e) =>
              setNewBooking({
                ...newBooking,
                customerName: e.target.value,
              })
            }
          />
        </div>


        <div className="booking-form-field">
          <label>
            Số điện thoại
          </label>

          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={newBooking.phone}
            onChange={(e) =>
              setNewBooking({
                ...newBooking,
                phone: e.target.value,
              })
            }
          />
        </div>


        <div className="booking-form-row">

          <div className="booking-form-field">
            <label>
              Loại khu
            </label>

            <select
              value={newBooking.category}
              onChange={(e) =>
                setNewBooking({
                  ...newBooking,
                  category: e.target.value,
                  site: '',
                })
              }
            >
              <option value="Camping">
                Camping
              </option>

              <option value="Glamping">
                Glamping
              </option>

              <option value="Lodge">
                Lodge
              </option>

              <option value="RV">
                RV
              </option>
            </select>
          </div>


          <div className="booking-form-field">
            <label>
              Site
            </label>

            <select
              value={newBooking.site}
              onChange={(e) =>
                setNewBooking({
                  ...newBooking,
                  site: e.target.value,
                })
              }
            >
              <option value="">
                Chọn site
              </option>

              {newBooking.category === 'Camping' && (
                <>
                  {['C1', 'C2', 'C3', 'C4'].map((site) => (
      siteStatuses[site] !== 'maintenance' && (
        <option key={site} value={site}>
          {site}
        </option>
      )
    ))}
                </>
              )}

              {newBooking.category === 'Glamping' && (
  <>
    {['G1', 'G2', 'G3'].map((site) => (
      siteStatuses[site] !== 'maintenance' && (
        <option key={site} value={site}>
          {site}
        </option>
      )
    ))}
  </>
)}

              {newBooking.category === 'Lodge' && (
  <>
    {['L1', 'L2'].map((site) => (
      siteStatuses[site] !== 'maintenance' && (
        <option key={site} value={site}>
          {site}
        </option>
      )
    ))}
  </>
)}

              {newBooking.category === 'RV' && (
  <>
    {['RV1', 'RV2'].map((site) => (
      siteStatuses[site] !== 'maintenance' && (
        <option key={site} value={site}>
          {site}
        </option>
      )
    ))}
  </>
)}

            </select>
          </div>

        </div>


        <div className="booking-form-row">

          <div className="booking-form-field">
            <label>
              Check-in
            </label>

            <input
              type="date"
              value={newBooking.checkIn}
              onChange={(e) =>
                setNewBooking({
                  ...newBooking,
                  checkIn: e.target.value,
                })
              }
            />
          </div>


          <div className="booking-form-field">
            <label>
              Check-out
            </label>

            <input
              type="date"
              value={newBooking.checkOut}
              onChange={(e) =>
                setNewBooking({
                  ...newBooking,
                  checkOut: e.target.value,
                })
              }
            />
          </div>

        </div>


        <div className="booking-form-field">
          <label>
            Số khách
          </label>

          <input
            type="number"
            min="1"
            value={newBooking.guests}
            onChange={(e) =>
              setNewBooking({
                ...newBooking,
                guests: Number(e.target.value),
              })
            }
          />
        </div>

      </div>


      <div className="booking-modal-footer">

        <button
          type="button"
          className="booking-modal-cancel"
          onClick={() => setIsCreateModalOpen(false)}
        >
          Hủy
        </button>

        <button
          type="button"
          className="booking-modal-save"
          onClick={handleCreateBooking}
        >
          Tạo đặt chỗ
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}