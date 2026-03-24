const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// --- 1. Security & Middleware ---
app.use(helmet()); // Sets HTTP Security Headers securely
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // V2 Frontend Access Validation
app.use(express.json());
app.use(cookieParser());

// --- 2. Microservice Global Rate Limiting (Redis-backed in Prod) ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window`
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', globalLimiter);

// --- 3. Winston Logger Implementation ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// --- 4. Microservices Routing Dashboard ---
// (We mount each isolated service to the main Gateway router here)
app.use('/api/auth', require('./services/auth-service/routes'));
app.use('/api/search', require('./services/search-service/routes'));
app.use('/api/airports', require('./services/airport-service/routes'));
app.use('/api/booking', require('./services/booking-service/routes'));
app.use('/api/payment', require('./services/payment-service/routes'));
app.use('/api/tracking', require('./services/tracking-service/routes'));
app.use('/api/notifications', require('./services/notification-service/routes'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TravelWise API Gateway is operational' });
});

// --- 5. Global Error Handler ---
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Microservice Failure' });
});

app.listen(PORT, () => {
  logger.info(`Enterprise Microservices Gateway running natively on http://localhost:${PORT}`);
});
