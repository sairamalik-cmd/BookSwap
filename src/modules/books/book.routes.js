'use strict';

const { Router } = require('express');
const authenticate = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createBookSchema, updateBookSchema, listBooksQuerySchema } = require('./book.validation');
const { listBooks, getBook, createBook, updateBook, deleteBook } = require('./book.controller');

const router = Router();

router.get('/', validate(listBooksQuerySchema, 'query'), listBooks);
router.get('/:id', getBook);
router.post('/', authenticate, validate(createBookSchema), createBook);
router.patch('/:id', authenticate, validate(updateBookSchema), updateBook);
router.delete('/:id', authenticate, deleteBook);

module.exports = router;
