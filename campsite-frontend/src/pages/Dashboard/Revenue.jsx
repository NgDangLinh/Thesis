import React, { useEffect, useMemo, useState } from 'react';
import './Revenue.css';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Revenue() {
  const [bookings, setBookings] = useState([]);

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
          area: booking.site_category,
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
        'Failed to load revenue data:',
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
    if (!dateString) {
      return null;
    }

    // Format: YYYY-MM-DD
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
    !booking.checkOut ||
    !booking.totalAmount
  ) {
    return 0;
  }

  const checkIn = parseDate(
    booking.checkIn
  );

  const checkOut = parseDate(
    booking.checkOut
  );

  if (!checkIn || !checkOut) {
    return 0;
  }

  const totalNights = getNights(
    booking.checkIn,
    booking.checkOut
  );

  if (totalNights <= 0) {
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

  const nightsInPeriod = Math.ceil(
    (actualEnd - actualStart) /
      (1000 * 60 * 60 * 24)
  );

  const revenuePerNight =
    Number(booking.totalAmount) /
    totalNights;

  return (
    nightsInPeriod *
    revenuePerNight
  );
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

  const siteCategoryMap = {
    C1: 'Camping',
    C2: 'Camping',
    C3: 'Camping',
    C4: 'Camping',

    G1: 'Glamping',
    G2: 'Glamping',
    G3: 'Glamping',

    L1: 'Lodge',
    L2: 'Lodge',

    RV1: 'RV',
    RV2: 'RV',
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
    const revenue = getRevenueInPeriod(
      booking,
      periodStart,
      periodEnd
    );

    if (!revenue) {
      return;
    }

    const category =
      siteCategoryMap[booking.site];

    if (category) {
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
            REVENUE
          </p>

          <h1>
            Revenue
          </h1>

          <p className="revenue-description">
            Revenue from the last 7 days by accommodation type.
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
            The past 7 days
          </p>

          <h2>
            {formatCurrency(totalRevenue)}
          </h2>

          <span>
            total recorded revenue
          </span>
        </div>


        {/* TRUNG BÌNH */}

        <div className="revenue-summary-card">
          <p>
            AVERAGE / DAY
          </p>

          <h2>
            {formatCurrency(averageRevenue)}
          </h2>

          <span>
            based on the last 7 days
          </span>
        </div>


        {/* CAO NHẤT */}

        <div className="revenue-summary-card">
          <p>
            TOP REVENUE CATEGORY
          </p>

          <h2>
            {topCategory.revenue > 0
              ? topCategory.category
              : 'No data available'}
          </h2>

          <span>
            {topCategory.revenue > 0
              ? formatCurrency(
                  topCategory.revenue
                )
              : 'No revenue recorded'}
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
            Revenue by Day
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
                        : '0đ'}
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
            Revenue by Category
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