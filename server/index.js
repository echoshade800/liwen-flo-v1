const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cycleRoutes = require('./routes/cycle');
const userRoutes = require('./routes/user');
const alarmRoutes = require('./routes/alarms');
const { initDatabase } = require('./database/init-db');

const app = express();
const PORT = process.env.BACKEND_PORT || 3007;

// Initialize database on startup
initDatabase().catch(console.error);

// Middleware
app.use(cors({
  origin: [`http://100.28.58.186:${process.env.FRONTEND_PORT || 5178}`, 'http://100.28.58.186:3007'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cycle', cycleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/alarms', alarmRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});