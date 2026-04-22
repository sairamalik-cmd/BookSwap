'use strict';

/**
 * Wraps an async route handler so errors are forwarded to next().
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
