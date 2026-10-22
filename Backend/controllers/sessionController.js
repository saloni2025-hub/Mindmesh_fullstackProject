import mongoose from 'mongoose';
import Session from '../models/Sessions.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const USER_FIELDS = 'name username avatar';

const shape = (s, meId) => {
  const me = String(meId);
  const iTeach = String(s.teacher._id) === me;
  const peer = iTeach ? s.learner : s.teacher;
  return {
    id: s._id,
    skill: s.skill,
    date: s.date,
    durationMins: s.durationMins,
    note: s.note,
    status: s.status,
    rating: s.rating,
    role: iTeach ? 'teaching' : 'learning',
    iAmRequester: String(s.requester) === me,
    peer: { username: peer.username, name: peer.name, avatar: peer.avatar },
  };
};

const loadMine = async (id, meId) => {
  if (!mongoose.isValidObjectId(id)) return null;
  const s = await Session.findById(id).populate('teacher learner', USER_FIELDS);
  if (!s) return null;
  const me = String(meId);
  if (String(s.teacher._id) !== me && String(s.learner._id) !== me) return null;
  return s;
};

export const listSessions = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const sessions = await Session.find({ $or: [{ teacher: me }, { learner: me }] })
    .sort({ date: 1 })
    .populate('teacher learner', USER_FIELDS);
  res.json({ sessions: sessions.map((s) => shape(s, me)) });
});

export const createSession = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const { peerUsername, skill, date, durationMins = 60, note = '', iTeach = false } = req.body;

  if (!peerUsername || !skill || !date) {
    return res.status(400).json({ message: 'Peer, skill and date are required' });
  }
  const peer = await User.findOne({ username: String(peerUsername).toLowerCase() });
  if (!peer) return res.status(404).json({ message: 'Peer not found' });
  if (String(peer._id) === String(me)) {
    return res.status(400).json({ message: 'You cannot book a session with yourself' });
  }
  const when = new Date(date);
  if (isNaN(when.getTime()) || when <= new Date()) {
    return res.status(400).json({ message: 'Please choose a future date and time' });
  }

  const session = await Session.create({
    requester: me,
    teacher: iTeach ? me : peer._id,
    learner: iTeach ? peer._id : me,
    skill: String(skill).trim(),
    date: when,
    durationMins: Number(durationMins) || 60,
    note: String(note).slice(0, 500),
  });
  await session.populate('teacher learner', USER_FIELDS);
  res.status(201).json({ session: shape(session, me) });
});

export const updateSession = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const { status } = req.body;
  const s = await loadMine(req.params.id, me);
  if (!s) return res.status(404).json({ message: 'Session not found' });

  const iAmRequester = String(s.requester) === String(me);

  if (status === 'accepted' || status === 'declined') {
    if (iAmRequester || s.status !== 'pending') {
      return res.status(400).json({ message: 'Only the invited peer can respond to a pending request' });
    }
  } else if (status === 'cancelled') {
    if (!['pending', 'accepted'].includes(s.status)) {
      return res.status(400).json({ message: 'This session can no longer be cancelled' });
    }
  } else if (status === 'completed') {
    if (s.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted sessions can be completed' });
    }
    if (s.date > new Date()) {
      return res.status(400).json({ message: 'This session has not started yet' });
    }
    await User.updateOne({ _id: s.teacher._id }, { $inc: { hoursTaught: s.durationMins / 60 } });
  } else {
    return res.status(400).json({ message: 'Invalid status' });
  }

  s.status = status;
  await s.save();
  res.json({ session: shape(s, me) });
});

export const rateSession = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const rating = Number(req.body.rating);
  const s = await loadMine(req.params.id, me);
  if (!s) return res.status(404).json({ message: 'Session not found' });
  if (String(s.learner._id) !== String(me)) {
    return res.status(403).json({ message: 'Only the learner can rate a session' });
  }
  if (s.status !== 'completed' || s.rating) {
    return res.status(400).json({ message: 'This session cannot be rated' });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be 1 to 5' });
  }

  const teacher = await User.findById(s.teacher._id);
  teacher.rating = Math.round(((teacher.rating * teacher.reviews + rating) / (teacher.reviews + 1)) * 10) / 10;
  teacher.reviews += 1;
  await teacher.save();

  s.rating = rating;
  await s.save();
  res.json({ session: shape(s, me) });
});