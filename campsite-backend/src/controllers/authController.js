const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !username.trim()) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Username is required',
      });
    }

    if (!password) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Password is required',
      });
    }

    // 2. Find user
    const [rows] = await db.query(
      `SELECT
        id,
        username,
        password_hash,
        role
       FROM users
       WHERE username = ?
       LIMIT 1`,
      [username.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Invalid username or password',
      });
    }

    const user = rows[0];

    // 3. Check password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Invalid username or password',
      });
    }

    // 4. Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      }
    );

    // 5. Return login result
    res.json({
      status: 'OK',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      status: 'ERROR',
      message: 'Login failed',
    });
  }
};

module.exports = {
  login,
};