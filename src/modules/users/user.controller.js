'use strict';

const userService = require('./user.service');
const catchAsync = require('../../utils/catchAsync');
const sendResponse = require('../../utils/sendResponse');

const getMe = catchAsync(async (req, res) => {
  const user = await userService.getMe(req.user.id);
  sendResponse(res, 200, { user });
});

const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateMe(req.user.id, req.body);
  sendResponse(res, 200, { user }, 'Profile updated successfully.');
});

module.exports = { getMe, updateMe };
