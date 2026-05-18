const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String },
    genre: { type: String },
    condition: { type: String },
    description: { type: String },
    image: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    availability: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);
