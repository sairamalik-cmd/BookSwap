'use strict';

const { Router } = require('express');
const authenticate = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { updateUserSchema } = require('./user.validation');
const { getMe, updateMe } = require('./user.controller');

const router = Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validate(updateUserSchema), updateMe);

module.exports = router;
