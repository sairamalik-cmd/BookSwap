'use strict';

const Joi = require('joi');

const CONDITIONS = ['new', 'like new', 'good', 'fair', 'poor'];
const STATUSES = ['available', 'reserved', 'swapped'];

const createBookSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  author: Joi.string().trim().max(200).required(),
  isbn: Joi.string().trim().max(20).allow(''),
  category: Joi.string().trim().max(100).allow(''),
  condition: Joi.string().valid(...CONDITIONS).required(),
  description: Joi.string().trim().max(2000).allow(''),
  images: Joi.array().items(Joi.string().uri()).max(10),
});

const updateBookSchema = Joi.object({
  title: Joi.string().trim().max(200),
  author: Joi.string().trim().max(200),
  isbn: Joi.string().trim().max(20).allow(''),
  category: Joi.string().trim().max(100).allow(''),
  condition: Joi.string().valid(...CONDITIONS),
  description: Joi.string().trim().max(2000).allow(''),
  images: Joi.array().items(Joi.string().uri()).max(10),
  status: Joi.string().valid(...STATUSES),
}).min(1);

const listBooksQuerySchema = Joi.object({
  search: Joi.string().trim().max(200).allow(''),
  category: Joi.string().trim().max(100).allow(''),
  condition: Joi.string().valid(...CONDITIONS),
  status: Joi.string().valid(...STATUSES),
  owner: Joi.string().trim(),
  sortBy: Joi.string().valid('createdAt', 'title', 'author').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = { createBookSchema, updateBookSchema, listBooksQuerySchema };
