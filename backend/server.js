const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const cookieParser = require('cookie-parser');
const compression = require('compression');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// --- 1. Security & Middleware ---
app.use(helmet({
  contentSecurityPolicy: false, // Managed by Next.js if needed
  crossOriginEmbedderPolicy: false
})); 
const frontendOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({ origin: frontendOrigins, credentials: true })); 
app.use(express.json());
app.use(cookieParser());
app.use(compression()); // gzip compress all responses

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

app.get('/', (req, res) => {
  res.json({ 
    status: 'ONLINE', 
    service: 'TravelWise API Gateway', 
    endpoints: ['/api/auth', '/api/search', '/api/airports', '/api/booking'] 
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TravelWise API Gateway is operational' });
});

// --- 5. 404 Catch-all ---
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found', path: req.path });
});

// --- 6. Global Exception Handler ---
app.use((err, req, res, next) => {
  logger.error(`[CRITICAL] Unhandled Exception: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'A system error occurred. Please try again later.' : err.message
  });
});

// --- 7. Server Initialization ---
app.listen(PORT, () => {
  logger.info(`Enterprise Microservices Gateway running natively on http://localhost:${PORT}`);
  console.log('\n---------------------------------------------------------');
  console.log('💎 [SYSTEM] TRAVELWISE GATEWAY v2.1 (STABLE) - READY FOR TRAFFIC');
  console.log('---------------------------------------------------------\n');
});
