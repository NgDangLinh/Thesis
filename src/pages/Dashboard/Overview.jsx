import React, { useEffect, useMemo, useState } from 'react';
import './Overview.css';
import { siteData } from '../../data/siteData';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const [bookings, setBookings] = useState([]);
  const [siteStatuses, setSiteStatuses] = useState({});
  const navigate = useNavigate();

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
  // LOAD SITE STATUSES
  // =========================

  useEffect(() => {
    const loadSiteStatuses = () => {
      const savedSiteStatuses =
        localStorage.getItem('siteStatuses');

      if (savedSiteStatuses) {
        setSiteStatuses(
          JSON.parse(savedSiteStatuses)
        );
      } else {
        setSiteStatuses({});
      }
    };

    loadSiteStatuses();

    window.addEventListener(
      'siteStatusesUpdated',
      loadSiteStatuses
    );

    return () => {
      window.removeEventListener(
        'siteStatusesUpdated',
        loadSiteStatuses
      );
    };
  }, []);

  // =========================
  // ALL SITES
  // =========================

  const allSites = useMemo(() => {
    return Object.values(siteData).flat();
  }, []);

  // =========================
  // ACTIVE SITES
  // Maintenance sites are
  // excluded from availability
  // =========================

  const activeSites = useMemo(() => {
    return allSites.filter(
      (site) =>
        siteStatuses[site.id] !== 'maintenance'
    );
  }, [allSites, siteStatuses]);

  const totalSites = activeSites.length;

  // =========================
  // DATE HELPERS
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
  // CHECK WHETHER SITE IS
  // CURRENTLY OCCUPIED
  // =========================

  const isSiteOccupied = (site) => {
    // Maintenance has highest priority
    if (
      siteStatuses[site.id] ===
      'maintenance'
    ) {
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
    siteStatuses,
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
        if (
          siteStatuses[
            booking.site
          ] === 'maintenance'
        ) {
          return total;
        }

        return (
          total +
          siteInfo.price
        );
      },
      0
    );
  }, [
    bookings,
    siteStatuses,
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

  const categoryStatus =
    useMemo(() => {
      return Object.entries(
        siteData
      ).map(
        ([category, sites]) => {
          // Remove maintenance sites
          const activeCategorySites =
            sites.filter(
              (site) =>
                siteStatuses[
                  site.id
                ] !==
                'maintenance'
            );

          const occupied =
            activeCategorySites.filter(
              (site) =>
                isSiteOccupied(site)
            ).length;

          return {
            category,
            occupied,
            total:
              activeCategorySites.length,
          };
        }
      );
    }, [
      bookings,
      siteStatuses,
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
            navigate('/admin/bookings', {
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