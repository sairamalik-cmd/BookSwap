'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xssSanitize = require('./middlewares/xssSanitize');
const rateLimit = require('express-rate-limit');

const config = require('./config/env');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const bookRoutes = require('./modules/books/book.routes');
const swapRoutes = require('./modules/swaps/swap.routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// Security headers
app.use(helmet());

// CORS - build explicit allowlist; '*' is only permitted in non-production environments
const corsOriginList = config.corsOrigin
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, same-origin)
      if (!origin) return callback(null, true);
      if (corsOriginList.includes('*') && config.nodeEnv !== 'production') {
        return callback(null, true);
      }
      if (corsOriginList.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// HTTP request logger
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize data - prevent NoSQL injection
app.use(mongoSanitize());

// Sanitize data - prevent XSS
app.use(xssSanitize);

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});
app.use('/api/v1/auth', authLimiter);

// Health check
app.get('/health', (req, res) => res.json({ success: true, message: 'Server is running.' }));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/swaps', swapRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
