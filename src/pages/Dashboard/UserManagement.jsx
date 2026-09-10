import React, { useEffect, useMemo, useState } from 'react';
import './UserManagement.css';
import { siteData } from '../../data/siteData';

export default function UserManagement() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // =========================
  // LOAD BOOKINGS
  // =========================

  useEffect(() => {
    const loadBookings = () => {
      const savedBookings =
        localStorage.getItem('bookings');

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        setBookings([]);
      }
    };

    loadBookings();

    window.addEventListener(
      'bookingsUpdated',
      loadBookings
    );

    return () => {
      window.removeEventListener(
        'bookingsUpdated',
        loadBookings
      );
    };
  }, []);

  // =========================
  // FIND SITE
  // =========================

  const getSiteInfo = (siteId) => {
    for (const category of Object.keys(siteData)) {
      const site = siteData[category].find(
        (item) => item.id === siteId
      );

      if (site) {
        return {
          ...site,
          category,
        };
      }
    }

    return null;
  };

  // =========================
  // PARSE DATE
  // =========================

  const parseDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    // YYYY-MM-DD
    if (dateString.includes('-')) {
      const [year, month, day] =
        dateString.split('-');

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
  // GET BOOKING PRICE
  // =========================

  const getBookingPrice = (booking) => {
    const siteInfo = getSiteInfo(booking.site);

    if (siteInfo) {
      return siteInfo.price;
    }

    // Fallback cho dữ liệu booking cũ
    const categoryPrices = {
      Camping: 290000,
      Glamping: 790000,
      Lodge: 1190000,
      RV: 950000,
    };

    return categoryPrices[booking.area] || 0;
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

      const pricePerNight =
        getBookingPrice(booking);

      const nights = getNights(
        booking.checkIn,
        booking.checkOut
      );

      customerMap[key].totalSpent +=
        pricePerNight * nights;
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
            SỐ KHÁCH
          </p>

          <h1>
            Khách hàng
          </h1>

          <p className="customers-description">
            Lịch sử lưu trú và chi tiêu của từng khách.
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
          placeholder="Tìm khách..."
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
            KHÁCH
          </div>

          <div>
            LIÊN HỆ
          </div>

          <div>
            GHÉ GẦN NHẤT
          </div>

          <div>
            TỔNG CHI TIÊU
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
              Không tìm thấy khách hàng
            </strong>

            <span>
              Thử tìm bằng tên hoặc số điện thoại khác.
            </span>

          </div>
        )}

      </div>

    </div>
  );
}