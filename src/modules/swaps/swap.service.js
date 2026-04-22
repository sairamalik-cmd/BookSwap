'use strict';

const Swap = require('./swap.model');
const Book = require('../books/book.model');
const ApiError = require('../../utils/ApiError');

const POPULATE_OPTS = [
  { path: 'requester', select: 'name email' },
  { path: 'requestedBook', populate: { path: 'owner', select: 'name email' } },
  { path: 'offeredBook', populate: { path: 'owner', select: 'name email' } },
];

const createSwap = async (requesterId, { requestedBook: requestedBookId, offeredBook: offeredBookId, message }) => {
  // Validate requested book exists and is available
  const requestedBook = await Book.findById(String(requestedBookId));
  if (!requestedBook) throw new ApiError(404, 'Requested book not found.');
  if (requestedBook.status !== 'available') throw new ApiError(409, 'Requested book is not available for swapping.');
  if (requestedBook.owner.toString() === requesterId) throw new ApiError(400, 'Cannot request a swap for your own book.');

  // Validate offered book if provided
  if (offeredBookId) {
    const offeredBook = await Book.findById(String(offeredBookId));
    if (!offeredBook) throw new ApiError(404, 'Offered book not found.');
    if (offeredBook.owner.toString() !== requesterId) throw new ApiError(403, 'You can only offer books you own.');
    if (offeredBook.status !== 'available') throw new ApiError(409, 'Offered book is not available for swapping.');
  }

  // Prevent duplicate pending swap
  const existing = await Swap.findOne({
    requester: String(requesterId),
    requestedBook: String(requestedBookId),
    status: 'pending',
  });
  if (existing) throw new ApiError(409, 'You already have a pending swap request for this book.');

  const swap = await Swap.create({
    requester: requesterId,
    requestedBook: requestedBookId,
    offeredBook: offeredBookId || undefined,
    message,
  });

  return Swap.findById(swap._id).populate(POPULATE_OPTS);
};

const getIncoming = async (userId) => {
  // Find swaps where the user owns the requested book
  const books = await Book.find({ owner: userId }).select('_id');
  const bookIds = books.map((b) => b._id);
  return Swap.find({ requestedBook: { $in: bookIds } }).populate(POPULATE_OPTS).sort('-createdAt');
};

const getOutgoing = async (userId) => {
  return Swap.find({ requester: userId }).populate(POPULATE_OPTS).sort('-createdAt');
};

const getSwap = async (swapId, userId) => {
  const swap = await Swap.findById(swapId).populate(POPULATE_OPTS);
  if (!swap) throw new ApiError(404, 'Swap not found.');

  const requestedBookOwnerId = swap.requestedBook.owner._id.toString();
  const requesterId = swap.requester._id.toString();

  if (userId !== requesterId && userId !== requestedBookOwnerId) {
    throw new ApiError(403, 'Not authorized to view this swap.');
  }
  return swap;
};

const acceptSwap = async (swapId, userId) => {
  const swap = await Swap.findById(swapId).populate('requestedBook');
  if (!swap) throw new ApiError(404, 'Swap not found.');
  if (swap.requestedBook.owner.toString() !== userId) throw new ApiError(403, 'Only the book owner can accept this swap.');
  if (swap.status !== 'pending') throw new ApiError(400, `Cannot accept a swap with status: ${swap.status}`);

  swap.status = 'accepted';
  // Reserve the requested book
  swap.requestedBook.status = 'reserved';
  await swap.requestedBook.save();
  await swap.save();

  return Swap.findById(swapId).populate(POPULATE_OPTS);
};

const rejectSwap = async (swapId, userId) => {
  const swap = await Swap.findById(swapId).populate('requestedBook');
  if (!swap) throw new ApiError(404, 'Swap not found.');
  if (swap.requestedBook.owner.toString() !== userId) throw new ApiError(403, 'Only the book owner can reject this swap.');
  if (swap.status !== 'pending') throw new ApiError(400, `Cannot reject a swap with status: ${swap.status}`);

  swap.status = 'rejected';
  await swap.save();

  return Swap.findById(swapId).populate(POPULATE_OPTS);
};

const completeSwap = async (swapId, userId) => {
  const swap = await Swap.findById(swapId).populate([
    { path: 'requester' },
    { path: 'requestedBook', populate: { path: 'owner' } },
    { path: 'offeredBook' },
  ]);
  if (!swap) throw new ApiError(404, 'Swap not found.');
  if (swap.status !== 'accepted') throw new ApiError(400, 'Swap must be accepted before it can be completed.');

  const requestedBookOwnerId = swap.requestedBook.owner._id.toString();
  const requesterId = swap.requester._id.toString();

  if (userId !== requesterId && userId !== requestedBookOwnerId) {
    throw new ApiError(403, 'Only swap participants can complete this swap.');
  }

  swap.status = 'completed';
  swap.requestedBook.status = 'swapped';
  await swap.requestedBook.save();

  if (swap.offeredBook) {
    await Book.findByIdAndUpdate(swap.offeredBook, { status: 'swapped' });
  }

  await swap.save();
  return Swap.findById(swapId).populate(POPULATE_OPTS);
};

const cancelSwap = async (swapId, userId) => {
  const swap = await Swap.findById(swapId).populate([
    { path: 'requester' },
    { path: 'requestedBook', populate: { path: 'owner' } },
  ]);
  if (!swap) throw new ApiError(404, 'Swap not found.');

  const requestedBookOwnerId = swap.requestedBook.owner._id.toString();
  const requesterId = swap.requester._id.toString();

  if (userId !== requesterId && userId !== requestedBookOwnerId) {
    throw new ApiError(403, 'Only swap participants can cancel this swap.');
  }

  if (!['pending', 'accepted'].includes(swap.status)) {
    throw new ApiError(400, `Cannot cancel a swap with status: ${swap.status}`);
  }

  // If the swap was accepted (book reserved), revert book status back to available
  if (swap.status === 'accepted') {
    swap.requestedBook.status = 'available';
    await swap.requestedBook.save();
  }

  swap.status = 'cancelled';
  await swap.save();

  return Swap.findById(swapId).populate(POPULATE_OPTS);
};

module.exports = { createSwap, getIncoming, getOutgoing, getSwap, acceptSwap, rejectSwap, completeSwap, cancelSwap };
