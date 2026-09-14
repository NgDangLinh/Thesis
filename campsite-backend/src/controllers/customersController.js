const db = require('../config/db');

const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        full_name,
        phone,
        email,
        created_at
       FROM customers
       ORDER BY id DESC`
    );

    res.json({
      status: 'OK',
      data: rows,
    });
  } catch (error) {
    console.error('Get customers error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to get customers',
    });
  }
};

module.exports = {
  getCustomers,
};