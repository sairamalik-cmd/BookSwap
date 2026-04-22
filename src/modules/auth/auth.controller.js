'use strict';

const authService = require('./auth.service');
const catchAsync = require('../../utils/catchAsync');
const sendResponse = require('../../utils/sendResponse');

const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  sendResponse(res, 201, { user, token }, 'Registration successful.');
});

const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  sendResponse(res, 200, { user, token }, 'Login successful.');
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  sendResponse(res, 200, { user });
});

module.exports = { register, login, getMe };
