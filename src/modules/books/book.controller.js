'use strict';

const bookService = require('./book.service');
const catchAsync = require('../../utils/catchAsync');
const sendResponse = require('../../utils/sendResponse');

const listBooks = catchAsync(async (req, res) => {
  const result = await bookService.listBooks(req.query);
  sendResponse(res, 200, result);
});

const getBook = catchAsync(async (req, res) => {
  const book = await bookService.getBook(req.params.id);
  sendResponse(res, 200, { book });
});

const createBook = catchAsync(async (req, res) => {
  const book = await bookService.createBook(req.user.id, req.body);
  sendResponse(res, 201, { book }, 'Book listing created.');
});

const updateBook = catchAsync(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.user.id, req.body);
  sendResponse(res, 200, { book }, 'Book listing updated.');
});

const deleteBook = catchAsync(async (req, res) => {
  await bookService.deleteBook(req.params.id, req.user.id);
  sendResponse(res, 200, null, 'Book listing deleted.');
});

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };
