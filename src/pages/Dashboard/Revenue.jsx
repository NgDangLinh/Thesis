import React, { useEffect, useMemo, useState } from 'react';
import './Revenue.css';
import { siteData } from '../../data/siteData';

export default function Revenue() {
  const [bookings, setBookings] = useState([]);

  // =========================
  // LOAD BOOKINGS
  // =========================

  useEffect(() => {
    const loadBookings = () => {
      const savedBookings = localStorage.getItem('bookings');

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        setBookings([]);
      }
    };

    loadBookings();

    window.addEventListener('bookingsUpdated', loadBookings);

    return () => {
      window.removeEventListener(
        'bookingsUpdated',
        loadBookings
      );
    };
  }, []);

  // =========================
  // TÌM THÔNG TIN SITE
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
  // TÍNH GIÁ BOOKING
  // =========================

  const getBookingPrice = (booking) => {
    const siteInfo = getSiteInfo(booking.site);

    // Nếu site tồn tại trong siteData
    if (siteInfo) {
      return siteInfo.price;
    }

    // Booking cũ có thể lưu category vào area
    const categoryPrices = {
      Camping: 290000,
      Glamping: 790000,
      Lodge: 1190000,
      RV: 950000,
    };

    return categoryPrices[booking.area] || 0;
  };

  // =========================
  // PARSE DATE
  // =========================

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

const getRevenueInPeriod = (
  booking,
  periodStart,
  periodEnd
) => {
  if (
    booking.status === 'cancelled' ||
    !booking.checkIn ||
    !booking.checkOut
  ) {
    return 0;
  }

  const checkIn = parseDate(booking.checkIn);
  const checkOut = parseDate(booking.checkOut);

  if (!checkIn || !checkOut) {
    return 0;
  }

  const pricePerNight = getBookingPrice(booking);

  if (!pricePerNight) {
    return 0;
  }

  const actualStart =
    checkIn > periodStart
      ? checkIn
      : periodStart;

  const actualEnd =
    checkOut < periodEnd
      ? checkOut
      : periodEnd;

  if (actualStart >= actualEnd) {
    return 0;
  }

  const nights = Math.ceil(
    (actualEnd - actualStart) /
      (1000 * 60 * 60 * 24)
  );

  return nights * pricePerNight;
};

  // =========================
  // FORMAT TIỀN
  // =========================

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('vi-VN')}đ`;
  };

  const formatShortCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}tr`;
    }

    if (amount >= 1000) {
      return `${Math.round(amount / 1000)}k`;
    }

    return amount.toLocaleString('vi-VN');
  };

  // =========================
  // 7 NGÀY GẦN NHẤT
  // =========================

  const dailyRevenue = useMemo(() => {
  const result = [];

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);

    date.setDate(
      today.getDate() - i
    );

    result.push({
      date,
      revenue: 0,
    });
  }

  bookings.forEach((booking) => {
    if (
      booking.status === 'cancelled' ||
      !booking.checkIn ||
      !booking.checkOut
    ) {
      return;
    }

    const checkIn = parseDate(booking.checkIn);
    const checkOut = parseDate(booking.checkOut);

    if (!checkIn || !checkOut) {
      return;
    }

    const pricePerNight = getBookingPrice(booking);

    if (!pricePerNight) {
      return;
    }

    result.forEach((day) => {
      const dayStart = new Date(day.date);

      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);

      dayEnd.setDate(
        dayStart.getDate() + 1
      );

      const revenue = getRevenueInPeriod(
        booking,
        dayStart,
        dayEnd
      );

      day.revenue += revenue;
    });
  });

  return result;
}, [bookings]);

  // =========================
  // TỔNG DOANH THU
  // =========================

  const totalRevenue = useMemo(() => {
    return dailyRevenue.reduce(
      (total, day) => total + day.revenue,
      0
    );
  }, [dailyRevenue]);

  // =========================
  // TRUNG BÌNH / NGÀY
  // =========================

  const averageRevenue = useMemo(() => {
    return Math.round(totalRevenue / 7);
  }, [totalRevenue]);

  // =========================
  // DOANH THU THEO LOẠI HÌNH
  // =========================

  const categoryRevenue = useMemo(() => {
  const result = {
    Camping: 0,
    Glamping: 0,
    Lodge: 0,
    RV: 0,
  };

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const periodStart = new Date(today);

  periodStart.setDate(
    today.getDate() - 6
  );

  const periodEnd = new Date(today);

  periodEnd.setDate(
    today.getDate() + 1
  );

  bookings.forEach((booking) => {
    const siteInfo = getSiteInfo(booking.site);

    if (!siteInfo) {
      return;
    }

    const revenue = getRevenueInPeriod(
      booking,
      periodStart,
      periodEnd
    );

    if (!revenue) {
      return;
    }

    const category = siteInfo.category;

    if (result[category] !== undefined) {
      result[category] += revenue;
    }
  });

  return Object.entries(result).map(
    ([category, revenue]) => ({
      category,
      revenue,
    })
  );
}, [bookings]);

  // =========================
  // LOẠI HÌNH DOANH THU CAO NHẤT
  // =========================

  const topCategory = useMemo(() => {
    return categoryRevenue.reduce(
      (top, current) =>
        current.revenue > top.revenue
          ? current
          : top,
      {
        category: '',
        revenue: 0,
      }
    );
  }, [categoryRevenue]);

  // =========================
  // GIÁ TRỊ LỚN NHẤT CỦA BIỂU ĐỒ
  // =========================

  const maxDailyRevenue = Math.max(
    ...dailyRevenue.map((day) => day.revenue),
    1
  );

  const maxCategoryRevenue = Math.max(
    ...categoryRevenue.map(
      (item) => item.revenue
    ),
    1
  );

  return (
    <div className="revenue-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="revenue-header">
        <div>
          <p className="revenue-kicker">
            SỔ QUỸ
          </p>

          <h1>
            Doanh thu
          </h1>

          <p className="revenue-description">
            Doanh thu 7 ngày gần đây và theo từng loại hình.
          </p>
        </div>
      </div>


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="revenue-summary">

        {/* 7 NGÀY */}

        <div className="revenue-summary-card">
          <p>
            7 NGÀY QUA
          </p>

          <h2>
            {formatCurrency(totalRevenue)}
          </h2>

          <span>
            tổng doanh thu ghi nhận
          </span>
        </div>


        {/* TRUNG BÌNH */}

        <div className="revenue-summary-card">
          <p>
            TRUNG BÌNH / NGÀY
          </p>

          <h2>
            {formatCurrency(averageRevenue)}
          </h2>

          <span>
            theo 7 ngày gần nhất
          </span>
        </div>


        {/* CAO NHẤT */}

        <div className="revenue-summary-card">
          <p>
            LOẠI HÌNH DOANH THU CAO NHẤT
          </p>

          <h2>
            {topCategory.revenue > 0
              ? topCategory.category
              : 'Chưa có dữ liệu'}
          </h2>

          <span>
            {topCategory.revenue > 0
              ? formatCurrency(
                  topCategory.revenue
                )
              : 'chưa có doanh thu'}
          </span>
        </div>

      </div>


      {/* =========================
          CONTENT
      ========================= */}

      <div className="revenue-content">

        {/* =========================
            DAILY REVENUE
        ========================= */}

        <div className="revenue-card revenue-daily-card">

          <h3>
            Doanh thu theo ngày
          </h3>

          <div className="revenue-chart">

            <div className="revenue-bars">

              {dailyRevenue.map((day) => {

                const height =
                  day.revenue === 0
                    ? 4
                    : Math.max(
                        10,
                        (day.revenue /
                          maxDailyRevenue) *
                          130
                      );

                const label =
                  `${String(
                    day.date.getDate()
                  ).padStart(2, '0')}/${
                    String(
                      day.date.getMonth() + 1
                    ).padStart(2, '0')
                  }`;

                return (
                  <div
                    className="revenue-bar-item"
                    key={day.date.toISOString()}
                  >

                    <span className="revenue-value">
                      {day.revenue > 0
                        ? formatShortCurrency(
                            day.revenue
                          )
                        : '-'}
                    </span>

                    <div
                      className="revenue-bar"
                      style={{
                        height: `${height}px`,
                      }}
                    />

                    <span>
                      {label}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

        </div>


        {/* =========================
            REVENUE BY CATEGORY
        ========================= */}

        <div className="revenue-card revenue-area-card">

          <h3>
            Doanh thu theo loại hình
          </h3>

          <div className="revenue-area-list">

            {categoryRevenue.map((item) => {

              const width =
                (item.revenue /
                  maxCategoryRevenue) *
                100;

              return (
                <div
                  className="revenue-area-item"
                  key={item.category}
                >

                  <div className="revenue-area-info">

                    <span>
                      {item.category}
                    </span>

                    <strong>
                      {formatCurrency(
                        item.revenue
                      )}
                    </strong>

                  </div>

                  <div className="revenue-area-track">

                    <div
                      className="revenue-area-progress"
                      style={{
                        width: `${width}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}