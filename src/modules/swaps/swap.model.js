'use strict';

const mongoose = require('mongoose');

const SWAP_STATUSES = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];

const swapSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required'],
    },
    requestedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Requested book is required'],
    },
    offeredBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: { values: SWAP_STATUSES, message: 'Invalid swap status' },
      default: 'pending',
    },
  },
  { timestamps: true }
);

swapSchema.index({ requester: 1 });
swapSchema.index({ requestedBook: 1 });

module.exports = mongoose.model('Swap', swapSchema);
