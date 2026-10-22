import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import sendEmail from '../utils/SendEmail.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const makeUsername = async (name) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'user';
  let username = base;
  while (await User.exists({ username })) {
    username = base + Math.floor(1000 + Math.random() * 9000);
  }
  return username;
};

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// naya OTP banao, DB me hash karke save karo, aur email bhejo
const issueOtp = async (user) => {
  const otp = String(crypto.randomInt(100000, 1000000));
  await User.updateOne(
    { _id: user._id },
    { otpHash: hashOtp(otp), otpExpires: new Date(Date.now() + 10 * 60 * 1000), otpAttempts: 0 }
  );
  sendEmail({
    to: user.email,
    subject: 'Your MindMesh verification code',
    html: `<h2>Hi ${user.name}!</h2>
           <p>Your verification code is:</p>
           <h1 style="letter-spacing:6px">${otp}</h1>
           <p>This code expires in 10 minutes.</p>`,
  });
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing && existing.isVerified) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  if (existing && !existing.isVerified) await existing.deleteOne(); // purana unverified signup hata do

  const username = await makeUsername(name);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    username,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=f97316`,
  });

  await issueOtp(user);
  res.status(201).json({ message: 'Verification code sent to your email', email: user.email });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otpHash +otpExpires +otpAttempts');
  if (!user) return res.status(400).json({ message: 'Account not found' });
  if (user.isVerified) return res.status(400).json({ message: 'Email already verified. Please log in.' });
  if (!user.otpHash || !user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }
  if (user.otpAttempts >= 5) {
    return res.status(429).json({ message: 'Too many wrong attempts. Please request a new OTP.' });
  }
  if (hashOtp(String(otp).trim()) !== user.otpHash) {
    await User.updateOne({ _id: user._id }, { $inc: { otpAttempts: 1 } });
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  await User.updateOne(
    { _id: user._id },
    { isVerified: true, $unset: { otpHash: 1, otpExpires: 1, otpAttempts: 1 } }
  );
  const fresh = await User.findById(user._id);
  res.json({ token: signToken(user._id), user: fresh });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otpExpires');
  if (!user || user.isVerified) return res.json({ message: 'If the account exists, a new OTP has been sent' });

  // 1 minute cooldown
  if (user.otpExpires && user.otpExpires.getTime() - Date.now() > 9 * 60 * 1000) {
    return res.status(429).json({ message: 'Please wait a minute before requesting another OTP' });
  }
  await issueOtp(user);
  res.json({ message: 'New OTP sent' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (user.isBlocked) {
    return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
  }
  if (!user.isVerified) {
    await issueOtp(user);
    return res.status(403).json({
      message: 'Please verify your email. We sent you a new code.',
      needsVerification: true,
      email: user.email,
    });
  }
  res.json({ token: signToken(user._id), user });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});