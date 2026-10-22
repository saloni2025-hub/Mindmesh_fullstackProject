import mongoose from 'mongoose';

const ref = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true };

const sessionSchema = new mongoose.Schema(
  {
    requester: ref,
    teacher: ref,
    learner: ref,
    skill: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    durationMins: { type: Number, default: 60 },
    note: { type: String, default: '', maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed'],
      default: 'pending',
    },
    rating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);