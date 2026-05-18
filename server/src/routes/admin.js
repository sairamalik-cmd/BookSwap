const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const { getUsers, deleteUser, deleteBook } = require('../controllers/adminController');

router.get('/users', auth, isAdmin, getUsers);
router.delete('/users/:id', auth, isAdmin, deleteUser);
router.delete('/books/:id', auth, isAdmin, deleteBook);

module.exports = router;
