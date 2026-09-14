const db = require('../config/db');

const createBooking = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      fullName,
      phone,
      email,
      siteId,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    // 1. Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Full name is required',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Phone number is required',
      });
    }

    if (!siteId) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Site ID is required',
      });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Check-in and check-out dates are required',
      });
    }

    if (!guests || Number(guests) <= 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Guests must be greater than 0',
      });
    }

    const guestCount = Number(guests);

    // 2. Validate date format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(checkIn) || !datePattern.test(checkOut)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Date must use YYYY-MM-DD format',
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Check-out date must be after check-in date',
      });
    }

    await connection.beginTransaction();

    // 3. Get site
    const [siteRows] = await connection.query(
      `SELECT
        id,
        category,
        area,
        type,
        capacity,
        price_per_night,
        status
       FROM sites
       WHERE id = ?
       FOR UPDATE`,
      [siteId]
    );

    if (siteRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        status: 'ERROR',
        message: 'Site not found',
      });
    }

    const site = siteRows[0];

    // 4. Check maintenance
    if (site.status === 'maintenance') {
      await connection.rollback();

      return res.status(409).json({
        status: 'ERROR',
        message: 'This site is currently under maintenance',
      });
    }

    // 5. Check capacity
    if (guestCount > site.capacity) {
      await connection.rollback();

      return res.status(400).json({
        status: 'ERROR',
        message: `This site can accommodate up to ${site.capacity} guests`,
      });
    }

    // 6. Check date conflict
    const [conflictingBookings] = await connection.query(
      `SELECT id
       FROM bookings
       WHERE site_id = ?
         AND status NOT IN ('cancelled', 'checked-out')
         AND check_in < ?
         AND check_out > ?
       LIMIT 1`,
      [siteId, checkOut, checkIn]
    );

    if (conflictingBookings.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        status: 'ERROR',
        message: 'This site is already booked for the selected dates',
      });
    }

    // 7. Calculate number of nights
    const checkInDate = new Date(`${checkIn}T00:00:00`);
    const checkOutDate = new Date(`${checkOut}T00:00:00`);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.round(
      (checkOutDate - checkInDate) / millisecondsPerDay
    );

    if (nights <= 0) {
      await connection.rollback();

      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid booking duration',
      });
    }

    // 8. Calculate total amount
    const pricePerNight = Number(site.price_per_night);

    const totalAmount = pricePerNight * nights;

    // 9. Find existing customer by phone
    const [customerRows] = await connection.query(
      `SELECT id
       FROM customers
       WHERE phone = ?
       LIMIT 1`,
      [phone.trim()]
    );

    let customerId;

    if (customerRows.length > 0) {
      customerId = customerRows[0].id;

      // Update customer information
      await connection.query(
        `UPDATE customers
         SET full_name = ?,
             email = ?
         WHERE id = ?`,
        [
          fullName.trim(),
          email?.trim() || null,
          customerId,
        ]
      );
    } else {
      // 10. Create new customer
      const [customerResult] = await connection.query(
        `INSERT INTO customers
          (full_name, phone, email)
         VALUES (?, ?, ?)`,
        [
          fullName.trim(),
          phone.trim(),
          email?.trim() || null,
        ]
      );

      customerId = customerResult.insertId;
    }

    // 11. Create booking
    const [bookingResult] = await connection.query(
      `INSERT INTO bookings
        (
          customer_id,
          site_id,
          check_in,
          check_out,
          guests,
          status,
          total_amount
        )
       VALUES (?, ?, ?, ?, ?, 'booked', ?)`,
      [
        customerId,
        siteId,
        checkIn,
        checkOut,
        guestCount,
        totalAmount,
      ]
    );

    await connection.commit();

    // 12. Return created booking
    res.status(201).json({
      status: 'OK',
      message: 'Booking created successfully',
      data: {
        id: bookingResult.insertId,
        customerId,
        siteId,
        checkIn,
        checkOut,
        guests: guestCount,
        nights,
        pricePerNight,
        totalAmount,
        status: 'booked',
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error('Create booking error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create booking',
    });
  } finally {
    connection.release();
  }
};

const getBookings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        b.id,
        b.customer_id,
        c.full_name AS customer_name,
        c.phone,
        c.email,

        b.site_id,
        s.category,
        s.area,
        s.type,

        b.check_in,
        b.check_out,
        b.guests,
        b.status,
        b.total_amount,

        b.created_at,
        b.updated_at

       FROM bookings b

       INNER JOIN customers c
         ON b.customer_id = c.id

       INNER JOIN sites s
         ON b.site_id = s.id

       ORDER BY b.id DESC`
    );

    res.json({
      status: 'OK',
      data: rows,
    });
  } catch (error) {
    console.error('Get bookings error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to get bookings',
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT
        b.id,
        b.customer_id,
        c.full_name AS customer_name,
        c.phone,
        c.email,

        b.site_id,
        s.category,
        s.area,
        s.type,
        s.capacity,
        s.price_per_night,

        b.check_in,
        b.check_out,
        b.guests,
        b.status,
        b.total_amount,

        b.created_at,
        b.updated_at

       FROM bookings b

       INNER JOIN customers c
         ON b.customer_id = c.id

       INNER JOIN sites s
         ON b.site_id = s.id

       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Booking not found',
      });
    }

    res.json({
      status: 'OK',
      data: rows[0],
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to get booking',
    });
  }
};

const updateBooking = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;

    const {
      fullName,
      phone,
      email,
      siteId,
      checkIn,
      checkOut,
      guests,
      status,
    } = req.body;

    // 1. Validate required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Full name is required',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Phone number is required',
      });
    }

    if (!siteId) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Site ID is required',
      });
    }

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Check-in and check-out dates are required',
      });
    }

    if (!guests || Number(guests) <= 0) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Guests must be greater than 0',
      });
    }

    const guestCount = Number(guests);

    // 2. Validate status
    const allowedStatuses = [
      'booked',
      'checked-in',
      'checked-out',
      'cancelled',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid booking status',
      });
    }

    // 3. Validate date format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(checkIn) || !datePattern.test(checkOut)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Date must use YYYY-MM-DD format',
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Check-out date must be after check-in date',
      });
    }

    await connection.beginTransaction();

    // 4. Check booking exists
    const [bookingRows] = await connection.query(
      `SELECT id, customer_id
       FROM bookings
       WHERE id = ?
       FOR UPDATE`,
      [id]
    );

    if (bookingRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        status: 'ERROR',
        message: 'Booking not found',
      });
    }

    const booking = bookingRows[0];

    // 5. Get site
    const [siteRows] = await connection.query(
      `SELECT
        id,
        capacity,
        price_per_night,
        status
       FROM sites
       WHERE id = ?
       FOR UPDATE`,
      [siteId]
    );

    if (siteRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        status: 'ERROR',
        message: 'Site not found',
      });
    }

    const site = siteRows[0];

    // 6. Check maintenance
    if (
      site.status === 'maintenance' &&
      status !== 'cancelled'
    ) {
      await connection.rollback();

      return res.status(409).json({
        status: 'ERROR',
        message: 'This site is currently under maintenance',
      });
    }

    // 7. Check capacity
    if (guestCount > site.capacity) {
      await connection.rollback();

      return res.status(400).json({
        status: 'ERROR',
        message: `This site can accommodate up to ${site.capacity} guests`,
      });
    }

    // 8. Check date conflict
    if (status !== 'cancelled') {
      const [conflictingBookings] = await connection.query(
        `SELECT id
         FROM bookings
         WHERE site_id = ?
           AND id != ?
           AND status NOT IN ('cancelled', 'checked-out')
           AND check_in < ?
           AND check_out > ?
         LIMIT 1`,
        [
          siteId,
          id,
          checkOut,
          checkIn,
        ]
      );

      if (conflictingBookings.length > 0) {
        await connection.rollback();

        return res.status(409).json({
          status: 'ERROR',
          message: 'This site is already booked for the selected dates',
        });
      }
    }

    // 9. Calculate nights
    const checkInDate = new Date(`${checkIn}T00:00:00`);
    const checkOutDate = new Date(`${checkOut}T00:00:00`);

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.round(
      (checkOutDate - checkInDate) /
        millisecondsPerDay
    );

    if (nights <= 0) {
      await connection.rollback();

      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid booking duration',
      });
    }

    // 10. Calculate total amount
    const pricePerNight =
      Number(site.price_per_night);

    const totalAmount =
      pricePerNight * nights;

    // 11. Update customer
    await connection.query(
      `UPDATE customers
       SET full_name = ?,
           phone = ?,
           email = ?
       WHERE id = ?`,
      [
        fullName.trim(),
        phone.trim(),
        email?.trim() || null,
        booking.customer_id,
      ]
    );

    // 12. Update booking
    await connection.query(
      `UPDATE bookings
       SET site_id = ?,
           check_in = ?,
           check_out = ?,
           guests = ?,
           status = ?,
           total_amount = ?
       WHERE id = ?`,
      [
        siteId,
        checkIn,
        checkOut,
        guestCount,
        status || 'booked',
        totalAmount,
        id,
      ]
    );

    await connection.commit();

    res.json({
      status: 'OK',
      message: 'Booking updated successfully',
      data: {
        id: Number(id),
        siteId,
        checkIn,
        checkOut,
        guests: guestCount,
        nights,
        pricePerNight,
        totalAmount,
        status: status || 'booked',
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error('Update booking error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to update booking',
    });
  } finally {
    connection.release();
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT id, status
       FROM bookings
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Booking not found',
      });
    }

    const booking = rows[0];

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'checked-out') {
      return res.status(400).json({
        status: 'ERROR',
        message: 'A checked-out booking cannot be cancelled',
      });
    }

    await db.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = ?`,
      [id]
    );

    res.json({
      status: 'OK',
      message: 'Booking cancelled successfully',
      data: {
        id: Number(id),
        status: 'cancelled',
      },
    });
  } catch (error) {
    console.error('Cancel booking error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to cancel booking',
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
};