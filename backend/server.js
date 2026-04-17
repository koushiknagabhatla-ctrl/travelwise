const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// --- Security & Middleware ---
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// --- Rate Limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

// --- Logger ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

// --- Service Routes ---
app.use('/api/auth', require('./services/auth-service/routes'));
app.use('/api/search', require('./services/search-service/routes'));
app.use('/api/airports', require('./services/airport-service/routes'));
app.use('/api/booking', require('./services/booking-service/routes'));
app.use('/api/payment', require('./services/payment-service/routes'));
app.use('/api/tracking', require('./services/tracking-service/routes'));
app.use('/api/notifications', require('./services/notification-service/routes'));
app.use('/api/weather', require('./services/weather-service/routes'));
app.use('/api/currency', require('./services/currency-service/routes'));
app.use('/api/alerts', require('./services/alert-service/routes'));

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TravelWise API Gateway — All Systems Operational',
    services: [
      'auth', 'search', 'airports', 'booking', 'payment',
      'tracking', 'notifications', 'weather', 'currency', 'alerts'
    ],
    timestamp: new Date().toISOString(),
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`TravelWise API Gateway running on http://localhost:${PORT}`);
  logger.info(`Services: auth, search, airports, booking, payment, tracking, notifications, weather, currency, alerts`);
});
