import React, { useEffect, useMemo, useState } from 'react';
import './UserManagement.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function UserManagement() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

// =========================
// LOAD BOOKINGS FROM API
// =========================

useEffect(() => {
  const loadBookings = async () => {
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
        alert(
          result.message ||
            'Failed to load bookings.'
        );
        return;
      }

      const formattedBookings =
        result.data.map((booking) => ({
          id: booking.id,
          customerName: booking.customer_name,
          phone: booking.phone,
          site: booking.site_id,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          guests: booking.guests,
          status: booking.status,
          totalAmount: Number(
            booking.total_amount
          ),
        }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error(
        'Failed to load customer data:',
        error
      );

      alert('Cannot connect to server.');
    }
  };

  loadBookings();
}, []);



  // =========================
  // PARSE DATE
  // =========================

  const parseDate = (dateString) => {
   // YYYY-MM-DD or ISO date
if (dateString.includes('-')) {
  const datePart =
    dateString.slice(0, 10);

  const [year, month, day] =
    datePart.split('-');

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
}
    // DD/MM/YYYY
    if (dateString.includes('/')) {
      const [day, month, year] =
        dateString.split('/');

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
    }

    return null;
  };

  // =========================
  // CALCULATE NIGHTS
  // =========================

  const getNights = (checkIn, checkOut) => {
    const startDate = parseDate(checkIn);
    const endDate = parseDate(checkOut);

    if (!startDate || !endDate) {
      return 0;
    }

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    return Math.max(
      0,
      Math.ceil(
        (endDate - startDate) /
          millisecondsPerDay
      )
    );
  };

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('vi-VN')}đ`;
  };

  // =========================
  // BUILD CUSTOMER LIST
  // =========================

  const customers = useMemo(() => {
    const customerMap = {};

    bookings.forEach((booking) => {
      if (
        !booking.customerName ||
        !booking.phone
      ) {
        return;
      }

      const customerName =
        booking.customerName.trim();

      const phone =
        booking.phone.trim();

      const key =
        `${customerName.toLowerCase()}_${phone}`;

      if (!customerMap[key]) {
        customerMap[key] = {
          name: customerName,
          phone,
          latestVisit: null,
          totalSpent: 0,
        };
      }

      // =========================
      // LATEST VISIT
      // =========================

      const checkIn = parseDate(
        booking.checkIn
      );

      if (
        checkIn &&
        (
          !customerMap[key].latestVisit ||
          checkIn >
            customerMap[key].latestVisit
        )
      ) {
        customerMap[key].latestVisit =
          checkIn;
      }

      // =========================
      // TOTAL SPENDING
      // =========================

      if (
        booking.status === 'cancelled'
      ) {
        return;
      }

      customerMap[key].totalSpent +=
  Number(booking.totalAmount || 0);
    });

    return Object.values(customerMap).sort(
      (a, b) => {
        if (
          !a.latestVisit &&
          !b.latestVisit
        ) {
          return 0;
        }

        if (!a.latestVisit) {
          return 1;
        }

        if (!b.latestVisit) {
          return -1;
        }

        return (
          b.latestVisit -
          a.latestVisit
        );
      }
    );
  }, [bookings]);

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = useMemo(() => {
    const search =
      searchTerm
        .toLowerCase()
        .trim();

    if (!search) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(search) ||
        customer.phone
          .toLowerCase()
          .includes(search)
    );
  }, [
    customers,
    searchTerm,
  ]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return '--/--';
    }

    return `${String(
      date.getDate()
    ).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;
  };

  return (
    <div className="customers-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="customers-header">
        <div>
          <p className="customers-kicker">
            CUSTOMERS
          </p>

          <h1>
            Customer
          </h1>

          <p className="customers-description">
            View customer stay history and spending
          </p>
        </div>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="customers-search">
        <span className="customers-search-icon">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* =========================
          CUSTOMER TABLE
      ========================= */}

      <div className="customers-table-card">

        <div className="customers-table-header">

          <div>
            CUSTOMER
          </div>

          <div>
            CONTACT
          </div>

          <div>
            LAST VISIT
          </div>

          <div>
            TOTAL SPENDING
          </div>

        </div>

        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(
            (customer, index) => (
              <div
                className="customers-table-row"
                key={`${customer.phone}-${index}`}
              >

                {/* KHÁCH */}

                <div className="customer-name">
                  {customer.name}
                </div>

                {/* LIÊN HỆ */}

                <div className="customer-phone">
                  {customer.phone}
                </div>

                {/* GHÉ GẦN NHẤT */}

                <div className="customer-last-visit">
                  {formatDate(
                    customer.latestVisit
                  )}
                </div>

                {/* TỔNG CHI TIÊU */}

                <div className="customer-total-spent">
                  {formatCurrency(
                    customer.totalSpent
                  )}
                </div>

              </div>
            )
          )
        ) : (
          <div className="customers-empty">

            <strong>
              No customers found
            </strong>

            <span>
              Try searching by a different name or phone number.
            </span>

          </div>
        )}

      </div>

    </div>
  );
}