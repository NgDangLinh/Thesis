import React, { useEffect, useState } from 'react';
import './SiteMap.css';
import { siteData } from '../../data/siteData';


export default function SiteMap() {
  const [selectedSite, setSelectedSite] = useState(null);
  const [sitesData, setSitesData] = useState(() => {
  const savedSiteStatuses = localStorage.getItem('siteStatuses');

  if (!savedSiteStatuses) {
    return siteData;
  }

  const savedStatuses = JSON.parse(savedSiteStatuses);

  const restoredData = {};

  Object.keys(siteData).forEach((category) => {
    restoredData[category] = siteData[category].map((site) => ({
      ...site,
      status: savedStatuses[site.id] || 'available',
    }));
  });

  return restoredData;
});
  const [bookings, setBookings] = useState([]);

  const handleStatusChange = (siteId, newStatus) => {
  setSitesData((currentData) => {
    const updatedData = { ...currentData };

    Object.keys(updatedData).forEach((category) => {
      updatedData[category] = updatedData[category].map((site) =>
        site.id === siteId
          ? { ...site, status: newStatus }
          : site
      );
    });

    // Lưu trạng thái của tất cả site
    const updatedStatuses = {};

    Object.values(updatedData).forEach((sites) => {
      sites.forEach((site) => {
        updatedStatuses[site.id] = site.status || 'available';
      });
    });

    localStorage.setItem(
      'siteStatuses',
      JSON.stringify(updatedStatuses)
    );

    window.dispatchEvent(new Event('siteStatusesUpdated'));

    return updatedData;
  });

  setSelectedSite((currentSite) =>
    currentSite
      ? { ...currentSite, status: newStatus }
      : currentSite
  );
};

useEffect(() => {
  const savedBookings = localStorage.getItem('bookings');

  if (savedBookings) {
    setBookings(JSON.parse(savedBookings));
  }
}, []);

const getSiteStatus = (site) => {
  // 1. Bảo trì có ưu tiên cao nhất
  if (site.status === 'maintenance') {
    return 'maintenance';
  }

  // 2. Nếu không bảo trì thì mới kiểm tra booking
  const booking = bookings.find(
    (item) =>
      item.site === site.id &&
      item.status !== 'checked-out' &&
      item.status !== 'cancelled'
  );

  // 3. Không có booking → Trống
  if (!booking) {
    return 'available';
  }

  // 4. Có khách đang ở
  if (booking.status === 'checked-in') {
    return 'staying';
  }

  // 5. Có booking nhưng chưa check-in
  return 'occupied';
};


  return (
  <div className="site-map-page">
    <div className="site-map-header">
      <p className="site-map-kicker">SƠ ĐỒ TRẠI</p>

      <h1>Bản đồ khu camping</h1>

      <p>
        Quản lý vị trí, loại hình và trạng thái của từng lô trại.
      </p>
    </div>

    <div className="site-map-legend">
  <div className="legend-item">
    <span className="legend-dot legend-dot--available"></span>
    <span>Trống</span>
  </div>

  <div className="legend-item">
    <span className="legend-dot legend-dot--occupied"></span>
    <span>Đã đặt</span>
  </div>

    <div className="legend-item">
  <span className="legend-dot legend-dot--checked-in"></span>
  <span>Đang ở</span>
</div>

  <div className="legend-item">
    <span className="legend-dot legend-dot--maintenance"></span>
    <span>Bảo trì</span>
  </div>
</div>

    <div className="site-map-content">
  {Object.entries(sitesData).map(([category, sites]) => (
    <section className="site-category" key={category}>
      <div className="site-category-header">
        <h2>{category}</h2>
      </div>

      <div className="site-grid">
        {sites.map((site) => (
          <div
  className={`site-card site-card--${getSiteStatus(site)}`}
  key={site.id}
  onClick={() =>
    setSelectedSite({
      ...site,
      status: getSiteStatus(site),
    })
  }
>
            <div className="site-card-icon">△</div>

            <strong className="site-card-id">
              {site.id}
            </strong>

            <span className="site-card-type">
  {site.type} · {site.capacity} khách
</span>

<span className="site-card-area">
  {site.area}
</span>
          </div>
        ))}
      </div>
    </section>
  ))}
</div>
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
        onClick={() => setSelectedSite(null)}
      >
        ×
      </button>
    </div>

    <div className="site-detail-status">
      <span
        className={`site-detail-status-dot site-detail-status-dot--${selectedSite.status}`}
      ></span>

      <span>
        {selectedSite.status === 'available'
          ? 'Trống'
          : selectedSite.status === 'occupied'
          ? 'Đã đặt'
          : selectedSite.status === 'checked-in'
          ? 'Đang ở'
          : 'Bảo trì'}
      </span>
    </div>

    <div className="site-detail-control">
  <label htmlFor="site-status">
    Trạng thái
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
    <option value="available">Trống</option>
    <option value="occupied">Đã đặt</option>
    <option value="maintenance">Bảo trì</option>
    <option value="checked-in">Đang ở</option>
  </select>
</div>

    <div className="site-detail-info">
      <div className="site-detail-item">
        <span>Khu vực</span>
        <strong>{selectedSite.area}</strong>
      </div>

      <div className="site-detail-item">
        <span>Loại</span>
        <strong>{selectedSite.type}</strong>
      </div>

      <div className="site-detail-item">
        <span>Sức chứa</span>
        <strong>{selectedSite.capacity} khách</strong>
      </div>

      <div className="site-detail-item">
        <span>Giá</span>
        <strong>
          {selectedSite.price.toLocaleString()} VND / đêm
        </strong>
      </div>
    </div>
  </div>
)}
  </div>
);
}