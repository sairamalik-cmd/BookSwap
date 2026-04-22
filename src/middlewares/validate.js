'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Returns a middleware that validates req[property] against a Joi schema.
 * @param {object} schema - Joi schema
 * @param {'body'|'query'|'params'} property
 */
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return next(new ApiError(422, 'Validation failed.', errors));
  }
  req[property] = value;
  next();
};

module.exports = validate;
