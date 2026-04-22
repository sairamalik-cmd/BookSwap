'use strict';

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const config = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required. Please provide a Bearer token.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired.'));
    }
    return next(new ApiError(401, 'Invalid token.'));
  }
};

module.exports = authenticate;
