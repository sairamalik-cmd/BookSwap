const Swap = require('../models/Swap');
const Book = require('../models/Book');

exports.createSwap = async (req, res) => {
  try {
    const requester = req.userId; // from auth
    const { owner, requestedBook, offeredBook } = req.body;
    if (!owner || !requestedBook || !offeredBook) return res.status(400).json({ msg: 'Owner, requested book, and offered book are required' });
    if (String(owner) === String(requester)) return res.status(400).json({ msg: 'Cannot request your own book' });

    const requested = await Book.findById(requestedBook);
    if (!requested) return res.status(404).json({ msg: 'Requested book not found' });
    if (String(requested.owner) !== String(owner)) return res.status(400).json({ msg: 'Requested book owner mismatch' });
    if (requested.availability === false) return res.status(400).json({ msg: 'Requested book is not available' });

    const pendingExisting = await Swap.findOne({ requestedBook, status: 'Pending' });
    if (pendingExisting) return res.status(400).json({ msg: 'There is already a pending request for this book' });

    const offered = await Book.findById(offeredBook);
    if (!offered) return res.status(404).json({ msg: 'Offered book not found' });
    if (String(offered.owner) !== String(requester)) return res.status(400).json({ msg: 'Offered book must belong to requester' });

    requested.availability = false;
    await requested.save();
    const swap = new Swap({ requester, owner, requestedBook, offeredBook });
    await swap.save();
    res.status(201).json(swap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find().populate('requester owner requestedBook offeredBook');
    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMySwaps = async (req, res) => {
  try {
    const userId = req.userId;
    const swaps = await Swap.find({ $or: [{ requester: userId }, { owner: userId }] }).populate('requester owner requestedBook offeredBook');
    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ msg: 'Swap not found' });
    if (String(swap.owner) !== String(req.userId)) return res.status(403).json({ msg: 'Only the book owner can update status' });

    const { status } = req.body;
    const allowed = ['Accepted', 'Rejected', 'Completed'];
    if (!allowed.includes(status)) return res.status(400).json({ msg: 'Invalid status' });
    if (swap.status !== 'Pending' && status !== 'Completed') return res.status(400).json({ msg: 'Only pending swaps can be accepted or rejected' });
    if (status === 'Completed' && swap.status !== 'Accepted') return res.status(400).json({ msg: 'Only accepted swaps can be completed' });

    if (status === 'Rejected') {
      const requested = await Book.findById(swap.requestedBook);
      if (requested) {
        requested.availability = true;
        await requested.save();
      }
    }

    if (status === 'Completed') {
      const requested = await Book.findById(swap.requestedBook);
      const offered = await Book.findById(swap.offeredBook);
      if (!requested || !offered) return res.status(404).json({ msg: 'Books not found for completion' });

      const requesterId = swap.requester;
      const ownerId = swap.owner;
      requested.owner = requesterId;
      offered.owner = ownerId;
      requested.availability = true;
      offered.availability = true;
      await requested.save();
      await offered.save();
    }
    swap.status = status;
    await swap.save();
    res.json(swap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
