'use strict';

const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const config = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed.';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
    errors = [];
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for field: ${field}`;
    errors = [];
  }

  // JWT errors handled upstream in auth middleware, but just in case
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token.';
  }

  if (config.nodeEnv === 'development') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;
