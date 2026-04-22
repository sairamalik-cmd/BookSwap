'use strict';

const { Router } = require('express');
const authenticate = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { registerSchema, loginSchema } = require('./auth.validation');
const { register, login, getMe } = require('./auth.controller');

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

module.exports = router;
