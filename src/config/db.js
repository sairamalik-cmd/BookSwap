'use strict';

const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  const conn = await mongoose.connect(config.mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
