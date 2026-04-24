import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    tag1: {
      type: String,
      trim: true,
      default: null,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    spent: {
      type: Number,
      required: true,
      default: 0,
    },
    budget: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Planning', 'Active', 'Done'],
      default: 'Planning',
    },
    type: {
      type: String,
      enum: ['planning', 'active', 'completed'],
      default: 'planning',
    },
    color: {
      type: String,
      default: 'bg-blue-100',
    },
    bar: {
      type: String,
      default: 'bg-blue-500',
    },
    text: {
      type: String,
      default: '0% committed',
    },
  },
  {
    timestamps: true,
  },
);

tripSchema.index({ createdAt: -1 });
tripSchema.index({ status: 1 });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
