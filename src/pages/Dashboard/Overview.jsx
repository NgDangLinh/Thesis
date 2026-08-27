import React from 'react';
import './Overview.css';

export default function Overview() {
  return (
    <div className="overview-page">
      <section className="overview-header">
        <div className="overview-title-group">
          <div className="overview-tag">Forest Guard Station · Wednesday, Aug 12</div>
          <h1>Camping Area Overview</h1>
          <p>Track campsite occupancy, arrivals/departures, and today’s revenue.</p>
        </div>

        <button type="button" className="overview-action">+ Create booking</button>
      </section>

      <section className="overview-stats-grid">
        <article className="stat-card">
          <div className="stat-label">Occupancy Rate</div>
          <div className="stat-value">17%</div>
          <div className="stat-description">2/12 sites currently occupied</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Revenue Today</div>
          <div className="stat-value">1,880,000₫</div>
          <div className="stat-description">from active campsite rentals</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Check-ins Today</div>
          <div className="stat-value">2</div>
          <div className="stat-description">guest arrivals</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Check-outs Today</div>
          <div className="stat-value">0</div>
          <div className="stat-description">guest departures</div>
        </article>
      </section>

      <section className="overview-bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Upcoming schedule</h2>
            <span className="view-all">View all →</span>
          </div>

          <div className="schedule-list">
            <div className="schedule-item">
              <div className="schedule-top">
                <p className="schedule-name">Tran Thi Bich · Site H3</p>
                <span className="schedule-status active">Checked in</span>
              </div>
              <div className="schedule-date">10/08 → 14/08 · 5 guests</div>
            </div>
            <div className="schedule-item">
              <div className="schedule-top">
                <p className="schedule-name">Nguyen Van An · Site H1</p>
                <span className="schedule-status active">Checked in</span>
              </div>
              <div className="schedule-date">11/08 → 13/08 · 3 guests</div>
            </div>
            <div className="schedule-item">
              <div className="schedule-top">
                <p className="schedule-name">Le Hoang Long · Site R2</p>
                <span className="schedule-status booked">Booked</span>
              </div>
              <div className="schedule-date">12/08 → 15/08 · 2 guests</div>
            </div>
            <div className="schedule-item">
              <div className="schedule-top">
                <p className="schedule-name">Pham Minh Khue · Site D3</p>
                <span className="schedule-status booked">Booked</span>
              </div>
              <div className="schedule-date">12/08 → 14/08 · 7 guests</div>
            </div>
            <div className="schedule-item">
              <div className="schedule-top">
                <p className="schedule-name">Vu Duc Nam · Site H5</p>
                <span className="schedule-status booked">Booked</span>
              </div>
              <div className="schedule-date">14/08 → 16/08 · 4 guests</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Status by area</h2>
          </div>

          <div className="status-row">
            <div className="status-item">
              <span><span>Lakeside</span><strong>3/5</strong></span>
              <div className="status-track"><div className="status-bar" style={{ width: '60%' }} /></div>
            </div>
            <div className="status-item">
              <span><span>Pine Forest</span><strong>2/4</strong></span>
              <div className="status-track"><div className="status-bar" style={{ width: '50%' }} /></div>
            </div>
            <div className="status-item">
              <span><span>Hilltop</span><strong>1/3</strong></span>
              <div className="status-track"><div className="status-bar" style={{ width: '33%' }} /></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
