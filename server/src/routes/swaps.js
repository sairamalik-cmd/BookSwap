const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createSwap, getSwaps, getMySwaps, updateSwap } = require('../controllers/swapsController');

router.post('/', auth, createSwap);
router.get('/', auth, getSwaps);
router.get('/my', auth, getMySwaps);
router.put('/:id', auth, updateSwap);

module.exports = router;
