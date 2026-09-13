const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());
app.use('/api/health', healthRoutes);

// =========================
// TEST ROUTE
// =========================

app.get('/', (req, res) => {
  res.json({
    message: 'Mojen Retreat API is running',
  });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});