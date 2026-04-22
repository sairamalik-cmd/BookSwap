'use strict';

const User = require('./user.model');
const ApiError = require('../../utils/ApiError');

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

const updateMe = async (userId, updateData) => {
  // Use $set explicitly to prevent any operator injection from updateData
  const user = await User.findByIdAndUpdate(String(userId), { $set: updateData }, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

module.exports = { getMe, updateMe };
