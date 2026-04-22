'use strict';

const Book = require('./book.model');
const ApiError = require('../../utils/ApiError');

const listBooks = async ({ search, category, condition, status, owner, sortBy, order, page, limit }) => {
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    // Escape user input before using in RegExp to prevent regex injection
    const escapedCategory = String(category).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.category = new RegExp(escapedCategory, 'i');
  }
  if (condition) filter.condition = String(condition);
  if (status) filter.status = String(status);
  if (owner) filter.owner = String(owner);

  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    Book.find(filter).sort(sort).skip(skip).limit(limit).populate('owner', 'name email location'),
    Book.countDocuments(filter),
  ]);

  return {
    books,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

const getBook = async (id) => {
  const book = await Book.findById(id).populate('owner', 'name email location');
  if (!book) throw new ApiError(404, 'Book not found.');
  return book;
};

const createBook = async (ownerId, data) => {
  const book = await Book.create({ ...data, owner: ownerId });
  return book.populate('owner', 'name email location');
};

const updateBook = async (bookId, userId, data) => {
  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(404, 'Book not found.');
  if (book.owner.toString() !== userId) throw new ApiError(403, 'Not authorized to update this book.');

  Object.assign(book, data);
  await book.save();
  return book.populate('owner', 'name email location');
};

const deleteBook = async (bookId, userId) => {
  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(404, 'Book not found.');
  if (book.owner.toString() !== userId) throw new ApiError(403, 'Not authorized to delete this book.');

  await book.deleteOne();
};

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };
