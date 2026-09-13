import React, { useEffect, useState } from 'react';
import './SiteMap.css';
import { siteData } from '../../data/siteData';

export default function SiteMap() {
  const [selectedSite, setSelectedSite] = useState(null);

  const [sitesData, setSitesData] = useState(() => {
    const savedSiteStatuses =
      localStorage.getItem('siteStatuses');

    if (!savedSiteStatuses) {
      return siteData;
    }

    const savedStatuses =
      JSON.parse(savedSiteStatuses);

    const restoredData = {};

    Object.keys(siteData).forEach((category) => {
      restoredData[category] =
        siteData[category].map((site) => ({
          ...site,
          status:
            savedStatuses[site.id] ||
            'available',
        }));
    });

    return restoredData;
  });

  const [bookings, setBookings] = useState([]);

  const handleStatusChange = (
    siteId,
    newStatus
  ) => {
    setSitesData((currentData) => {
      const updatedData = {
        ...currentData,
      };

      Object.keys(updatedData).forEach(
        (category) => {
          updatedData[category] =
            updatedData[category].map(
              (site) =>
                site.id === siteId
                  ? {
                      ...site,
                      status: newStatus,
                    }
                  : site
            );
        }
      );

      const updatedStatuses = {};

      Object.values(updatedData).forEach(
        (sites) => {
          sites.forEach((site) => {
            updatedStatuses[site.id] =
              site.status || 'available';
          });
        }
      );

      localStorage.setItem(
        'siteStatuses',
        JSON.stringify(updatedStatuses)
      );

      window.dispatchEvent(
        new Event('siteStatusesUpdated')
      );

      return updatedData;
    });

    setSelectedSite((currentSite) =>
      currentSite
        ? {
            ...currentSite,
            status: newStatus,
          }
        : currentSite
    );
  };

  useEffect(() => {
    const savedBookings =
      localStorage.getItem('bookings');

    if (savedBookings) {
      setBookings(
        JSON.parse(savedBookings)
      );
    }
  }, []);

  const getSiteStatus = (site) => {
    // Maintenance has the highest priority
    if (site.status === 'maintenance') {
      return 'maintenance';
    }

    // Check active bookings
    const booking = bookings.find(
      (item) =>
        item.site === site.id &&
        item.status !== 'checked-out' &&
        item.status !== 'cancelled'
    );

    // No booking = available
    if (!booking) {
      return 'available';
    }

    // Guest is currently staying
    if (booking.status === 'checked-in') {
      return 'staying';
    }

    // Booking exists but guest has not checked in
    return 'occupied';
  };

  const getStatusLabel = (status) => {
    if (status === 'available') {
      return 'Available';
    }

    if (status === 'occupied') {
      return 'Booked';
    }

    if (
      status === 'staying' ||
      status === 'checked-in'
    ) {
      return 'Staying';
    }

    if (status === 'maintenance') {
      return 'Maintenance';
    }

    return status;
  };

  return (
    <div className="site-map-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="site-map-header">
        <p className="site-map-kicker">
          SITE MAP
        </p>

        <h1>Campsite Map</h1>

        <p>
          Manage campsite locations, types,
          and current status.
        </p>
      </div>

      {/* =========================
          LEGEND
      ========================= */}

      <div className="site-map-legend">

        <div className="legend-item">
          <span className="legend-dot legend-dot--available"></span>
          <span>Available</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot legend-dot--occupied"></span>
          <span>Booked</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot legend-dot--checked-in"></span>
          <span>Staying</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot legend-dot--maintenance"></span>
          <span>Maintenance</span>
        </div>

      </div>

      {/* =========================
          SITE CATEGORIES
      ========================= */}

      <div className="site-map-content">

        {Object.entries(sitesData).map(
          ([category, sites]) => (
            <section
              className="site-category"
              key={category}
            >
              <div className="site-category-header">
                <h2>{category}</h2>
              </div>

              <div className="site-grid">

                {sites.map((site) => (
                  <div
                    className={`site-card site-card--${getSiteStatus(
                      site
                    )}`}
                    key={site.id}
                    onClick={() =>
                      setSelectedSite({
                        ...site,
                        status:
                          getSiteStatus(site),
                      })
                    }
                  >

                    <div className="site-card-icon">
                      △
                    </div>

                    <strong className="site-card-id">
                      {site.id}
                    </strong>

                    <span className="site-card-type">
                      {site.type} · {site.capacity}{' '}
                      guests
                    </span>

                    <span className="site-card-area">
                      {site.area}
                    </span>

                  </div>
                ))}

              </div>
            </section>
          )
        )}

      </div>

      {/* =========================
          SITE DETAIL
      ========================= */}

      {selectedSite && (
        <div className="site-detail-panel">

          <div className="site-detail-header">

            <div>
              <p className="site-detail-kicker">
                SITE DETAIL
              </p>

              <h2>
                {selectedSite.id}
              </h2>
            </div>

            <button
              type="button"
              className="site-detail-close"
              onClick={() =>
                setSelectedSite(null)
              }
            >
              ×
            </button>

          </div>

          {/* STATUS */}

          <div className="site-detail-status">

            <span
              className={`site-detail-status-dot site-detail-status-dot--${selectedSite.status}`}
            ></span>

            <span>
              {getStatusLabel(
                selectedSite.status
              )}
            </span>

          </div>

          {/* STATUS CONTROL */}

          <div className="site-detail-control">

            <label htmlFor="site-status">
              Status
            </label>

            <select
              id="site-status"
              value={selectedSite.status}
              onChange={(e) =>
                handleStatusChange(
                  selectedSite.id,
                  e.target.value
                )
              }
            >
              <option value="available">
                Available
              </option>

              <option value="occupied">
                Booked
              </option>

              <option value="maintenance">
                Maintenance
              </option>

              <option value="checked-in">
                Staying
              </option>
            </select>

          </div>

          {/* SITE INFORMATION */}

          <div className="site-detail-info">

            <div className="site-detail-item">
              <span>Area</span>
              <strong>
                {selectedSite.area}
              </strong>
            </div>

            <div className="site-detail-item">
              <span>Type</span>
              <strong>
                {selectedSite.type}
              </strong>
            </div>

            <div className="site-detail-item">
              <span>Capacity</span>
              <strong>
                {selectedSite.capacity} guests
              </strong>
            </div>

            <div className="site-detail-item">
              <span>Price</span>
              <strong>
                {selectedSite.price.toLocaleString(
                  'en-US'
                )}{' '}
                VND / night
              </strong>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}