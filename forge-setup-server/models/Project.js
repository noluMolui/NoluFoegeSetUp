const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    mainGoal: {
      type: String,
      trim: true,
    },
    monetization: {
      type: String,
      trim: true,
    },
    timeline: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    platform: {
      type: String,
      // Removed the strict enum and required constraint to prevent empty strings 
      // from crashing the request during onboarding wizard transitions
      default: 'web',
    },
    audience: {
      type: String,
      trim: true,
    },
    aesthetic: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    aiGeneratedBlueprint: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
