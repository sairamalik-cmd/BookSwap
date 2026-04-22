'use strict';

const swapService = require('./swap.service');
const catchAsync = require('../../utils/catchAsync');
const sendResponse = require('../../utils/sendResponse');

const createSwap = catchAsync(async (req, res) => {
  const swap = await swapService.createSwap(req.user.id, req.body);
  sendResponse(res, 201, { swap }, 'Swap request created.');
});

const getIncoming = catchAsync(async (req, res) => {
  const swaps = await swapService.getIncoming(req.user.id);
  sendResponse(res, 200, { swaps });
});

const getOutgoing = catchAsync(async (req, res) => {
  const swaps = await swapService.getOutgoing(req.user.id);
  sendResponse(res, 200, { swaps });
});

const getSwap = catchAsync(async (req, res) => {
  const swap = await swapService.getSwap(req.params.id, req.user.id);
  sendResponse(res, 200, { swap });
});

const acceptSwap = catchAsync(async (req, res) => {
  const swap = await swapService.acceptSwap(req.params.id, req.user.id);
  sendResponse(res, 200, { swap }, 'Swap accepted.');
});

const rejectSwap = catchAsync(async (req, res) => {
  const swap = await swapService.rejectSwap(req.params.id, req.user.id);
  sendResponse(res, 200, { swap }, 'Swap rejected.');
});

const completeSwap = catchAsync(async (req, res) => {
  const swap = await swapService.completeSwap(req.params.id, req.user.id);
  sendResponse(res, 200, { swap }, 'Swap completed.');
});

const cancelSwap = catchAsync(async (req, res) => {
  const swap = await swapService.cancelSwap(req.params.id, req.user.id);
  sendResponse(res, 200, { swap }, 'Swap cancelled.');
});

module.exports = { createSwap, getIncoming, getOutgoing, getSwap, acceptSwap, rejectSwap, completeSwap, cancelSwap };
