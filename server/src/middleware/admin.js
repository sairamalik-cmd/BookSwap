const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ msg: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
