import Message from '../models/Message.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const PEER = 'name username title avatar teaches wantsToLearn lastSeen';

const peerShape = (u) => ({
  username: u.username,
  name: u.name,
  title: u.title,
  avatar: u.avatar,
  online: u.online,
  teaches: u.teaches,
  wantsToLearn: u.wantsToLearn,
});

const msgShape = (m, meId) => ({
  id: m._id,
  from: String(m.sender) === String(meId) ? 'me' : 'them',
  text: m.text,
  createdAt: m.createdAt,
});

export const getConversations = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const msgs = await Message.find({ $or: [{ sender: me }, { recipient: me }] })
    .sort({ createdAt: -1 })
    .limit(1000)
    .populate('sender recipient', PEER);

  const map = new Map();
  for (const m of msgs) {
    if (!m.sender || !m.recipient) continue;
    const mine = String(m.sender._id) === String(me);
    const peer = mine ? m.recipient : m.sender;
    if (!map.has(peer.username)) {
      map.set(peer.username, {
        ...peerShape(peer),
        unread: 0,
        lastMessage: { text: m.text, from: mine ? 'me' : 'them', createdAt: m.createdAt },
      });
    }
    if (!mine && !m.read) map.get(peer.username).unread++;
  }
  res.json({ conversations: [...map.values()] });
});

export const getChat = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const peer = await User.findOne({ username: req.params.username.toLowerCase() }).select(PEER);
  if (!peer) return res.status(404).json({ message: 'User not found' });
  if (String(peer._id) === String(me)) {
    return res.status(400).json({ message: 'You cannot message yourself' });
  }

  await Message.updateMany({ sender: peer._id, recipient: me, read: false }, { read: true });

  const msgs = await Message.find({
    $or: [
      { sender: me, recipient: peer._id },
      { sender: peer._id, recipient: me },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(500);

  res.json({ peer: peerShape(peer), messages: msgs.map((m) => msgShape(m, me)) });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Message cannot be empty' });

  const peer = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!peer) return res.status(404).json({ message: 'User not found' });
  if (String(peer._id) === String(me)) {
    return res.status(400).json({ message: 'You cannot message yourself' });
  }

  const msg = await Message.create({ sender: me, recipient: peer._id, text });
  res.status(201).json({ message: msgShape(msg, me) });
});