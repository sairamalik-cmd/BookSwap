const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    offeredBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Swap', SwapSchema);
