'use strict';

const Joi = require('joi');

const updateUserSchema = Joi.object({
  name: Joi.string().trim().max(100),
  location: Joi.string().trim().max(200).allow(''),
  avatarUrl: Joi.string().trim().uri().allow(''),
}).min(1);

module.exports = { updateUserSchema };
