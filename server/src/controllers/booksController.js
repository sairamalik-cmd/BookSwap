const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, condition, description } = req.body;
    const owner = req.userId; // set by auth middleware

    if (!title) return res.status(400).json({ msg: 'Title is required' });

    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const book = new Book({ title, author, genre, condition, description, owner, image });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { q, genre, available } = req.query;
    const filter = {};

    if (available === 'true') filter.availability = true;
    if (genre) filter.genre = genre;
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { author: regex }];
    }

    const books = await Book.find(filter).populate('owner', 'name email');
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('owner', 'name email');
    if (!book) return res.status(404).json({ msg: 'Not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (String(book.owner) !== String(req.userId)) return res.status(403).json({ msg: 'Not authorized' });

    const allowed = ['title', 'author', 'genre', 'condition', 'description', 'availability'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    Object.assign(book, updates);
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (String(book.owner) !== String(req.userId)) return res.status(403).json({ msg: 'Not authorized' });

    await book.remove();
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
