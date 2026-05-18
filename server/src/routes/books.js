const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createBook, getBooks, getBookById, updateBook, deleteBook } = require('../controllers/booksController');

const uploadSingle = (req, res, next) => {
	upload.single('image')(req, res, err => {
		if (err) return res.status(400).json({ msg: err.message || 'Invalid upload' });
		next();
	});
};

router.post('/', auth, uploadSingle, createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', auth, uploadSingle, updateBook);
router.delete('/:id', auth, deleteBook);

module.exports = router;
