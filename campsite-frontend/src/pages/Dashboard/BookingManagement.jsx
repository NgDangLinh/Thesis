import React, { useEffect, useState } from 'react';
import './BookingManagement.css';
import { useLocation } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const location = useLocation();

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          alert('Please log in again.');
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/bookings`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          alert(result.message || 'Failed to load bookings.');
          return;
        }

        const formattedBookings = result.data.map((booking) => ({
          id: booking.id,
          customerName: booking.customer_name,
          phone: booking.phone,
          site: booking.site_id,
          area: booking.site_category,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          guests: booking.guests,
          status: booking.status,
          paymentStatus: booking.payment_status,
          totalAmount: Number(booking.total_amount),
        }));

        setBookings(formattedBookings);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        alert('Cannot connect to server.');
      }
    };

    fetchBookings();
  }, []);

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

    // Format: YYYY-MM-DD or ISO datetime
    if (dateString.includes('-')) {
      const datePart = dateString.slice(0, 10);
      const [year, month, day] = datePart.split('-');

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

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    const date = parseDate(dateString);

    if (!date) {
      return '-';
    }

    return date.toLocaleDateString('en-GB');
  };

  const handleCreateBooking = async () => {
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

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in again.');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: newBooking.customerName.trim(),
            phone: newBooking.phone.trim(),
            siteId: newBooking.site,
            checkIn: newBooking.checkIn,
            checkOut: newBooking.checkOut,
            guests: Number(newBooking.guests),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Failed to create booking.');
        return;
      }

      alert('Booking created successfully.');

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

      // Reload bookings from MySQL
      window.location.reload();
    } catch (error) {
      console.error('Create booking error:', error);
      alert('Cannot connect to server.');
    }
  };


  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
  };

  const handleSaveBooking = async () => {
    if (!editingBooking) {
      return;
    }

    if (!editingBooking.customerName.trim()) {
      alert('Please enter the customer name.');
      return;
    }

    if (!editingBooking.phone.trim()) {
      alert('Please enter the phone number.');
      return;
    }

    if (!editingBooking.site) {
      alert('Please select a site.');
      return;
    }

    if (!editingBooking.checkIn) {
      alert('Please select the check-in date.');
      return;
    }

    if (!editingBooking.checkOut) {
      alert('Please select the check-out date.');
      return;
    }

    if (editingBooking.checkOut <= editingBooking.checkIn) {
      alert('The check-out date must be after the check-in date.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in again.');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/bookings/${editingBooking.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: editingBooking.customerName.trim(),
            phone: editingBooking.phone.trim(),
            siteId: editingBooking.site,
            checkIn: editingBooking.checkIn.slice(0, 10),
            checkOut: editingBooking.checkOut.slice(0, 10),
            guests: Number(editingBooking.guests),
            status: editingBooking.status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Failed to update booking.');
        return;
      }

      alert('Booking updated successfully.');

      setEditingBooking(null);

      // Reload bookings from MySQL
      window.location.reload();
    } catch (error) {
      console.error('Update booking error:', error);
      alert('Cannot connect to server.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const booking = bookings.find(
      (item) => item.id === bookingId
    );

    if (!booking) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel the booking for ${booking.customerName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in again.');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Failed to cancel booking.');
        return;
      }

      alert('Booking cancelled successfully.');

      // Reload bookings from MySQL
      window.location.reload();
    } catch (error) {
      console.error('Cancel booking error:', error);
      alert('Cannot connect to server.');
    }
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
          <div>PAYMENT</div>
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
                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
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

              <div className="booking-payment">
                <span
                  className={`booking-payment-badge booking-payment-badge--${booking.paymentStatus || 'pending'
                    }`}
                >
                  {booking.paymentStatus === 'paid'
                    ? 'Paid'
                    : 'Pending'}
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

                <button
  type="button"
  className="booking-action-btn"
  title="Copy payment link"
  onClick={async () => {
    try {
      const paymentLink = `${window.location.origin}/payment?bookingId=${booking.id}`;

      await navigator.clipboard.writeText(paymentLink);

      alert('Payment link copied successfully.');
    } catch (error) {
      console.error('Copy payment link error:', error);
      alert('Failed to copy payment link.');
    }
  }}
>
  🔗
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