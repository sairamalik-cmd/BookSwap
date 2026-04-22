'use strict';

const { Router } = require('express');
const authenticate = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createSwapSchema } = require('./swap.validation');
const {
  createSwap,
  getIncoming,
  getOutgoing,
  getSwap,
  acceptSwap,
  rejectSwap,
  completeSwap,
  cancelSwap,
} = require('./swap.controller');

const router = Router();

// All swap routes require authentication
router.use(authenticate);

router.post('/', validate(createSwapSchema), createSwap);
router.get('/incoming', getIncoming);
router.get('/outgoing', getOutgoing);
router.get('/:id', getSwap);
router.patch('/:id/accept', acceptSwap);
router.patch('/:id/reject', rejectSwap);
router.patch('/:id/complete', completeSwap);
router.patch('/:id/cancel', cancelSwap);

module.exports = router;
