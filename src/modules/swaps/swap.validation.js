'use strict';

const Joi = require('joi');

const createSwapSchema = Joi.object({
  requestedBook: Joi.string().trim().required(),
  offeredBook: Joi.string().trim().allow(''),
  message: Joi.string().trim().max(1000).allow(''),
});

module.exports = { createSwapSchema };
