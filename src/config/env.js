'use strict';

require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

// Fail fast if JWT_SECRET is not configured in production
if (nodeEnv === 'production' && !process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable must be set in production.');
}

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/book_swap',
  jwtSecret: process.env.JWT_SECRET || 'dev_only_changeme_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  nodeEnv,
};
