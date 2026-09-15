import React, { useEffect, useMemo, useState } from 'react';
import './Overview.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function Overview() {
 const [bookings, setBookings] = useState([]);
const [sites, setSites] = useState([]);
const navigate = useNavigate();

// =========================
// LOAD DATA FROM API
// =========================

useEffect(() => {
  const loadOverviewData = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in again.');
        return;
      }

      const [bookingsResponse, sitesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/bookings`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_BASE_URL}/sites`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const bookingsResult = await bookingsResponse.json();
      const sitesResult = await sitesResponse.json();

      if (!bookingsResponse.ok) {
        alert(
          bookingsResult.message ||
            'Failed to load bookings.'
        );
        return;
      }

      if (!sitesResponse.ok) {
        alert(
          sitesResult.message ||
            'Failed to load sites.'
        );
        return;
      }

      const formattedBookings = bookingsResult.data.map(
        (booking) => ({
          id: booking.id,
          customerName: booking.customer_name,
          phone: booking.phone,
          site: booking.site_id,
          area: booking.site_category,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          guests: booking.guests,
          status: booking.status,
          totalAmount: Number(booking.total_amount),
        })
      );

      setBookings(formattedBookings);
      setSites(sitesResult.data);
    } catch (error) {
      console.error(
        'Failed to load overview data:',
        error
      );

      alert('Cannot connect to server.');
    }
  };

  loadOverviewData();
}, []);

  // =========================
  // ALL SITES
  // =========================

 const allSites = useMemo(() => {
  return sites;
}, [sites]);

  // =========================
  // ACTIVE SITES
  // Maintenance sites are
  // excluded from availability
  // =========================

  const activeSites = useMemo(() => {
  return allSites.filter(
    (site) => site.status !== 'maintenance'
  );
}, [allSites]);

  const totalSites = activeSites.length;

  // =========================
  // DATE HELPERS
  // =========================

  const parseDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  // YYYY-MM-DD or ISO date
  if (dateString.includes('-')) {
    const datePart = dateString.slice(0, 10);
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

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) {
      return false;
    }

    return (
      date1.getFullYear() ===
        date2.getFullYear() &&
      date1.getMonth() ===
        date2.getMonth() &&
      date1.getDate() ===
        date2.getDate()
    );
  };

  // =========================
  // TODAY
  // =========================

  const today = useMemo(() => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  // =========================
  // FIND SITE INFORMATION
  // =========================

  const getSiteInfo = (siteId) => {
  return (
    sites.find((site) => site.id === siteId) ||
    null
  );
};

  // =========================
  // CHECK WHETHER SITE IS
  // CURRENTLY OCCUPIED
  // =========================

  const isSiteOccupied = (site) => {
    // Maintenance has highest priority
   if (site.status === 'maintenance') {
  return false;
}

    return bookings.some((booking) => {
      if (booking.site !== site.id) {
        return false;
      }

      if (
        booking.status === 'cancelled' ||
        booking.status === 'checked-out'
      ) {
        return false;
      }

      const checkIn = parseDate(
        booking.checkIn
      );

      const checkOut = parseDate(
        booking.checkOut
      );

      if (!checkIn || !checkOut) {
        return false;
      }

      return (
        today >= checkIn &&
        today < checkOut
      );
    });
  };

  // =========================
  // OCCUPIED SITES
  // =========================

  const occupiedSites = useMemo(() => {
    return activeSites.filter(
      (site) =>
        isSiteOccupied(site)
    );
  }, [
    activeSites,
    bookings,
    today,
  ]);

  const occupiedCount =
    occupiedSites.length;

  // =========================
  // OCCUPANCY RATE
  // =========================

  const occupancyRate =
    totalSites > 0
      ? Math.round(
          (occupiedCount /
            totalSites) *
            100
        )
      : 0;

  // =========================
  // REVENUE TODAY
  // =========================

  const revenueToday = useMemo(() => {
    return bookings.reduce(
      (total, booking) => {
        if (
          booking.status ===
            'cancelled' ||
          booking.status ===
            'checked-out' ||
          !booking.checkIn ||
          !booking.checkOut
        ) {
          return total;
        }

        const checkIn = parseDate(
          booking.checkIn
        );

        const checkOut = parseDate(
          booking.checkOut
        );

        if (!checkIn || !checkOut) {
          return total;
        }

        // Booking must be active today
        if (
          today < checkIn ||
          today >= checkOut
        ) {
          return total;
        }

        // Find the actual site
        const siteInfo =
          getSiteInfo(
            booking.site
          );

        if (!siteInfo) {
          return total;
        }

        // Maintenance sites are not active rentals
        if (siteInfo.status === 'maintenance') {
  return total;
}

        return (
  total +
  Number(siteInfo.price_per_night)
);
      },
      0
    );
  }, [
    bookings,
    sites,
    today,
  ]);

  // =========================
  // CHECK-INS TODAY
  // =========================

  const checkInsToday = useMemo(() => {
    return bookings.filter(
      (booking) => {
        if (
          booking.status ===
            'cancelled' ||
          booking.status ===
            'checked-out' ||
          !booking.checkIn
        ) {
          return false;
        }

        const checkIn =
          parseDate(
            booking.checkIn
          );

        return isSameDay(
          checkIn,
          today
        );
      }
    ).length;
  }, [
    bookings,
    today,
  ]);

  // =========================
  // CHECK-OUTS TODAY
  // =========================

  const checkOutsToday = useMemo(() => {
    return bookings.filter(
      (booking) => {
        if (
          booking.status ===
            'cancelled' ||
          !booking.checkOut
        ) {
          return false;
        }

        const checkOut =
          parseDate(
            booking.checkOut
          );

        return isSameDay(
          checkOut,
          today
        );
      }
    ).length;
  }, [
    bookings,
    today,
  ]);

  // =========================
  // UPCOMING SCHEDULE
  // =========================

  const upcomingBookings =
    useMemo(() => {
      return [...bookings]
        .filter((booking) => {
          if (
            booking.status ===
              'cancelled' ||
            booking.status ===
              'checked-out' ||
            !booking.checkIn ||
            !booking.checkOut
          ) {
            return false;
          }

          const checkOut =
            parseDate(
              booking.checkOut
            );

          return (
            checkOut &&
            checkOut >= today
          );
        })
        .sort((a, b) => {
          const dateA =
            parseDate(
              a.checkIn
            );

          const dateB =
            parseDate(
              b.checkIn
            );

          if (!dateA) {
            return 1;
          }

          if (!dateB) {
            return -1;
          }

          return dateA - dateB;
        })
        .slice(0, 5);
    }, [
      bookings,
      today,
    ]);

  // =========================
// STATUS BY CATEGORY
// =========================

const categoryStatus = useMemo(() => {
  const categories = [
    'Camping',
    'Glamping',
    'Lodge',
    'RV',
  ];

  return categories.map((category) => {
    const categorySites = sites.filter(
      (site) => site.category === category
    );

    // Remove maintenance sites
    const activeCategorySites =
      categorySites.filter(
        (site) => site.status !== 'maintenance'
      );

    const occupied =
      activeCategorySites.filter(
        (site) => isSiteOccupied(site)
      ).length;

    return {
      category,
      occupied,
      total: activeCategorySites.length,
    };
  });
}, [
  bookings,
  sites,
  today,
]);

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (
    amount
  ) => {
    return `${amount.toLocaleString(
      'vi-VN'
    )}₫`;
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (
    dateString
  ) => {
    const date =
      parseDate(dateString);

    if (!date) {
      return '';
    }

    return `${String(
      date.getDate()
    ).padStart(
      2,
      '0'
    )}/${String(
      date.getMonth() + 1
    ).padStart(
      2,
      '0'
    )}`;
  };

  // =========================
  // FORMAT TODAY
  // =========================

  const formatToday = () => {
    return today.toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }
    );
  };

  // =========================
  // BOOKING STATUS LABEL
  // =========================

  const getStatusLabel = (
    status
  ) => {
    if (
      status ===
      'checked-in'
    ) {
      return 'Checked in';
    }

    if (
      status ===
      'booked'
    ) {
      return 'Booked';
    }

    return status;
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="overview-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="overview-header">

        <div className="overview-title-group">

          <div className="overview-tag">
            Forest Guard Station ·{' '}
            {formatToday()}
          </div>

          <h1>
            Camping Area Overview
          </h1>

          <p>
            Track campsite occupancy,
            arrivals/departures, and
            today’s revenue.
          </p>

        </div>

        <button
          type="button"
          className="overview-action"
          onClick={() =>
            navigate('/admin/booking', {
              state: {
                openCreateBooking: true,
    },
  })
}
        >
          + Create booking
        </button>

      </section>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="overview-stats-grid">

        {/* OCCUPANCY */}

        <article className="stat-card">

          <div className="stat-label">
            Occupancy Rate
          </div>

          <div className="stat-value">
            {occupancyRate}%
          </div>

          <div className="stat-description">
            {occupiedCount}/
            {totalSites} sites
            currently occupied
          </div>

        </article>

        {/* REVENUE */}

        <article className="stat-card">

          <div className="stat-label">
            Revenue Today
          </div>

          <div className="stat-value">
            {formatCurrency(
              revenueToday
            )}
          </div>

          <div className="stat-description">
            from active campsite
            rentals
          </div>

        </article>

        {/* CHECK-IN */}

        <article className="stat-card">

          <div className="stat-label">
            Check-ins Today
          </div>

          <div className="stat-value">
            {checkInsToday}
          </div>

          <div className="stat-description">
            guest arrivals
          </div>

        </article>

        {/* CHECK-OUT */}

        <article className="stat-card">

          <div className="stat-label">
            Check-outs Today
          </div>

          <div className="stat-value">
            {checkOutsToday}
          </div>

          <div className="stat-description">
            guest departures
          </div>

        </article>

      </section>

      {/* =========================
          BOTTOM CONTENT
      ========================= */}

      <section className="overview-bottom-grid">

        {/* =========================
            UPCOMING SCHEDULE
        ========================= */}

        <div className="panel">

          <div className="panel-header">

            <h2>
              Upcoming schedule
            </h2>

            <span className="view-all">
              View all →
            </span>

          </div>

          <div className="schedule-list">

            {upcomingBookings.length ===
            0 ? (
              <div className="schedule-item">

                <p className="schedule-name">
                  No upcoming bookings
                </p>

                <div className="schedule-date">
                  There are no active
                  bookings.
                </div>

              </div>
            ) : (
              upcomingBookings.map(
                (booking) => (
                  <div
                    className="schedule-item"
                    key={
                      booking.id
                    }
                  >

                    <div className="schedule-top">

                      <p className="schedule-name">
                        {
                          booking.customerName
                        }
                        {' · '}
                        Site{' '}
                        {
                          booking.site
                        }
                      </p>

                      <span
                        className={`schedule-status ${
                          booking.status ===
                          'checked-in'
                            ? 'active'
                            : 'booked'
                        }`}
                      >
                        {getStatusLabel(
                          booking.status
                        )}
                      </span>

                    </div>

                    <div className="schedule-date">

                      {formatDate(
                        booking.checkIn
                      )}

                      {' → '}

                      {formatDate(
                        booking.checkOut
                      )}

                      {' · '}

                      {
                        booking.guests
                      }{' '}
                      guests

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>

        {/* =========================
            STATUS BY CATEGORY
        ========================= */}

        <div className="panel">

          <div className="panel-header">

            <h2>
              Status by category
            </h2>

          </div>

          <div className="status-row">

            {categoryStatus.map(
              (item) => {

                const percentage =
                  item.total > 0
                    ? Math.round(
                        (item.occupied /
                          item.total) *
                          100
                      )
                    : 0;

                return (
                  <div
                    className="status-item"
                    key={
                      item.category
                    }
                  >

                    <span>

                      <span>
                        {
                          item.category
                        }
                      </span>

                      <strong>
                        {
                          item.occupied
                        }
                        /
                        {
                          item.total
                        }
                      </strong>

                    </span>

                    <div className="status-track">

                      <div
                        className="status-bar"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>

    </div>
  );
}