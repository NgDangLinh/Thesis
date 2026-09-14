const db = require('../config/db');

const getSites = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        category,
        area,
        type,
        capacity,
        price_per_night,
        status
       FROM sites
       ORDER BY id`
    );

    res.json({
      status: 'OK',
      data: rows,
    });
  } catch (error) {
    console.error('Get sites error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to get sites',
    });
  }
};

const getSiteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT
        id,
        category,
        area,
        type,
        capacity,
        price_per_night,
        status
       FROM sites
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Site not found',
      });
    }

    res.json({
      status: 'OK',
      data: rows[0],
    });
  } catch (error) {
    console.error('Get site by ID error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to get site',
    });
  }
};

const getAvailableSites = async (req, res) => {
  try {
    const { category, checkIn, checkOut, guests } = req.query;

    if (!category || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'category, checkIn, checkOut and guests are required',
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Check-out date must be after check-in date',
      });
    }

    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Guests must be a valid number',
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        s.id,
        s.category,
        s.area,
        s.type,
        s.capacity,
        s.price_per_night,
        s.status
      FROM sites s
      WHERE s.category = ?
        AND s.status = 'available'
        AND s.capacity >= ?
        AND NOT EXISTS (
          SELECT 1
          FROM bookings b
          WHERE b.site_id = s.id
            AND b.status NOT IN ('cancelled', 'checked-out')
            AND b.check_in < ?
            AND b.check_out > ?
        )
      ORDER BY s.id
      `,
      [category, guestCount, checkOut, checkIn]
    );

    res.json({
      status: 'OK',
      data: rows,
    });
  } catch (error) {
    console.error('Get available sites error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to get available sites',
    });
  }
};

module.exports = {
  getSites,
  getSiteById,
  getAvailableSites,
};