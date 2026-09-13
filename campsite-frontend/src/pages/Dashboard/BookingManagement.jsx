import React, { useEffect, useState } from 'react';
import './BookingManagement.css';
import { useLocation } from 'react-router-dom';

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState(() => {
  const savedBookings = localStorage.getItem('bookings');
  const location = useLocation();

  return savedBookings
    ? JSON.parse(savedBookings)
    : bookingData;
});


  const [editingBooking, setEditingBooking] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
  if (location.state?.openCreateBooking) {
    setIsCreateModalOpen(true);

    window.history.replaceState(
      {},
      document.title
    );
  }
}, [location.state]);

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

  // Thông báo cho các page khác rằng bookings đã thay đổi
  window.dispatchEvent(
    new Event('bookingsUpdated')
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

  const parseDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  // Format: YYYY-MM-DD
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  }

  // Format: DD/MM/YYYY
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  }

  return null;
};

    const handleCreateBooking = () => {
  if (!newBooking.customerName.trim()) {
    alert('Please enter the customer name.');
    return;
  }

  if (!newBooking.phone.trim()) {
    alert('Please enter the phone number.');
    return;
  }

  if (!newBooking.site) {
    alert('Please select a site.');
    return;
  }

  if (!newBooking.checkIn) {
    alert('Please select the check-in date.');
    return;
  }

  if (!newBooking.checkOut) {
    alert('Please select the check-out date.');
    return;
  }

  if (newBooking.checkOut <= newBooking.checkIn) {
    alert('The check-out date must be after the check-in date.');
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
  alert(`${selectedSite} is currently under maintenance and cannot be booked.`);
  return;
}

const siteAlreadyBooked = bookings.some((booking) => {
  // Chỉ kiểm tra booking của cùng site
  if (booking.site !== selectedSite) {
    return false;
  }

  // Booking đã trả hoặc đã hủy thì không còn chiếm site
  if (
    booking.status === 'checked-out' ||
    booking.status === 'cancelled'
  ) {
    return false;
  }

  // Kiểm tra khoảng ngày có bị trùng hay không
  const existingCheckIn = parseDate(booking.checkIn);
const existingCheckOut = parseDate(booking.checkOut);

const newCheckIn = parseDate(newBooking.checkIn);
const newCheckOut = parseDate(newBooking.checkOut);

  return (
    newCheckIn < existingCheckOut &&
    newCheckOut > existingCheckIn
  );
});

if (siteAlreadyBooked) {
  alert(
    `${selectedSite} is already booked for the selected period.`
  );
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
    `Are you sure you want to delete the booking for ${booking.customerName}?`
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
            BOOKINGS
          </p>

        <h1>Bookings</h1>

        <p className="booking-management-description">
  Manage reservations, check-ins, and check-outs.
</p>
        </div>

        <button
          type="button"
          className="booking-management-add-btn"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <span>+</span>
          New Booking
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
            placeholder="Search by customer or site..."
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
  All statuses
</option>

<option value="booked">
  Booked
</option>

<option value="checked-in">
  Checked in
</option>

<option value="checked-out">
  Checked out
</option>

<option value="cancelled">
  Cancelled
</option>
        </select>

      </div>
      <div className="booking-table-card">

  <div className="booking-table-header">
    <div>CUSTOMER</div>
<div>SITE</div>
<div>DATES</div>
<div>GUESTS</div>
<div>STATUS</div>
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
  ? 'Booked'
  : booking.status === 'checked-in'
  ? 'Checked in'
  : booking.status === 'checked-out'
  ? 'Checked out'
  : 'Cancelled'}
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
    <strong>No bookings found</strong>

    <span>
      Try searching for a different customer or site.
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
            EDIT BOOKING
          </p>

          <h2>
            Booking {editingBooking.id}
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
            Customer Name
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
            Phone number
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
              Site
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
              Category
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
              Guests
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
              Status
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
  Booked
</option>

<option value="checked-in">
  Checked in
</option>

<option value="checked-out">
  Checked out
</option>

<option value="cancelled">
  Cancelled
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
          Cancel
        </button>

        <button
          type="button"
          className="booking-modal-save"
          onClick={handleSaveBooking}
        >
          Save Changes
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
            NEW BOOKING
          </p>

          <h2>
            Create Booking
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
            Customer Name
          </label>

          <input
            type="text"
            placeholder="Enter customer name"
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
            Phone number
          </label>

          <input
            type="text"
            placeholder="Enter phone number"
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
              category
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
                Select Site
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
            Guests
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
          Cancel
        </button>

        <button
          type="button"
          className="booking-modal-save"
          onClick={handleCreateBooking}
        >
          Create Booking
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}