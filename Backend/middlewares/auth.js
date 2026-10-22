import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    // keep "online" status fresh (updated at most once a minute)
    if (Date.now() - user.lastSeen.getTime() > 60 * 1000) {
      user.lastSeen = new Date();
      await User.updateOne({ _id: user._id }, { lastSeen: user.lastSeen });
    }
    if (user.isBlocked) return res.status(403).json({ message: 'Your account has been blocked' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};