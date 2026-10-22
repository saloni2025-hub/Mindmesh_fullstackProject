import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const PUBLIC = 'name username title bio avatar teaches wantsToLearn availability rating reviews hoursTaught lastSeen';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const cleanList = (arr) =>
  Array.isArray(arr)
    ? [...new Set(arr.map((s) => String(s).trim()).filter(Boolean))].slice(0, 20)
    : undefined;

export const listUsers = asyncHandler(async (req, res) => {
  const { q = '', skill = '' } = req.query;
  const and = [];
  if (q.trim()) {
    const rx = new RegExp(escapeRegex(q.trim()), 'i');
    and.push({ $or: [{ name: rx }, { username: rx }, { title: rx }, { teaches: rx }] });
  }
  if (skill.trim()) {
    and.push({ teaches: new RegExp(escapeRegex(skill.trim()), 'i') });
  }
  const filter = { _id: { $ne: req.user._id }, ...(and.length && { $and: and }) };
  const users = await User.find(filter)
    .select(PUBLIC)
    .sort({ rating: -1, reviews: -1 })
    .limit(60);
  res.json({ users });
});

export const recommended = asyncHandler(async (req, res) => {
  const wanted = (req.user.wantsToLearn || []).map((s) => s.toLowerCase());
  const others = await User.find({ _id: { $ne: req.user._id } }).select(PUBLIC).limit(50);
  const score = (u) =>
    u.teaches.filter((t) =>
      wanted.some((w) => t.toLowerCase().includes(w) || w.includes(t.toLowerCase()))
    ).length;
  others.sort((a, b) => score(b) - score(a) || b.rating - a.rating);
  res.json({ users: others.slice(0, 4) });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(PUBLIC);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, title, bio, avatar, teaches, wantsToLearn, availability, onboarded } = req.body;
  const me = await User.findById(req.user._id);

  if (name !== undefined) {
    if (!String(name).trim()) return res.status(400).json({ message: 'Name cannot be empty' });
    me.name = String(name).trim();
  }
  if (title !== undefined) me.title = String(title).trim().slice(0, 100);
  if (bio !== undefined) me.bio = String(bio).trim().slice(0, 500);
  if (avatar !== undefined) {
    me.avatar = String(avatar).trim() || `https://i.pravatar.cc/150?u=${me.username}`;
  }
  const t = cleanList(teaches);
  if (t) me.teaches = t;
  const w = cleanList(wantsToLearn);
  if (w) me.wantsToLearn = w;
  if (Array.isArray(availability)) {
    me.availability = availability
      .filter((a) => DAYS.includes(a.day))
      .map((a) => ({ day: a.day, from: a.from || '09:00', to: a.to || '17:00' }));
  }
  if (onboarded !== undefined) me.onboarded = Boolean(onboarded);

  await me.save();
  res.json({ user: me });
});