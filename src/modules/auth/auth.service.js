'use strict';

const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');
const config = require('../../config/env');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

const register = async ({ name, email, password, location }) => {
  const existing = await User.findOne({ email: String(email) });
  if (existing) throw new ApiError(409, 'Email already registered.');

  const user = await User.create({ name, email: String(email), password, location });
  const token = generateToken(user._id);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: String(email) }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }
  const token = generateToken(user._id);
  return { user, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

module.exports = { register, login, getMe };
