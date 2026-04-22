'use strict';

const mongoose = require('mongoose');

const BOOK_CONDITIONS = ['new', 'like new', 'good', 'fair', 'poor'];
const BOOK_STATUSES = ['available', 'reserved', 'swapped'];

const bookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [200, 'Author cannot exceed 200 characters'],
    },
    isbn: {
      type: String,
      trim: true,
      maxlength: [20, 'ISBN cannot exceed 20 characters'],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    condition: {
      type: String,
      enum: { values: BOOK_CONDITIONS, message: 'Invalid condition value' },
      required: [true, 'Condition is required'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: { values: BOOK_STATUSES, message: 'Invalid status value' },
      default: 'available',
    },
  },
  { timestamps: true }
);

// Text index for search
bookSchema.index({ title: 'text', author: 'text', category: 'text' });
bookSchema.index({ owner: 1 });
bookSchema.index({ status: 1 });

module.exports = mongoose.model('Book', bookSchema);
