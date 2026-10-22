import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], required: true },
    from: { type: String, default: '09:00' },
    to: { type: String, default: '17:00' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    title: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    teaches: { type: [String], default: [] },
    wantsToLearn: { type: [String], default: [] },
    availability: { type: [availabilitySchema], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    hoursTaught: { type: Number, default: 0 },
    onboarded: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    otpHash: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
);

userSchema.virtual('online').get(function () {
  return this.lastSeen && Date.now() - this.lastSeen.getTime() < 5 * 60 * 1000;
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);