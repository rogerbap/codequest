// server/models/UserProgress.js
const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameMode: {
    type: String,
    enum: ['quickFire', 'career'],
    required: true
  },
  levelId: {
    type: Number,
    required: true
  },
  questionId: {
    type: Number,
    required: true
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  hintsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: Date,
  solution: String,
  sessionData: {
    startTime: Date,
    endTime: Date,
    codeSnapshots: [{
      timestamp: Date,
      code: String,
      testResults: mongoose.Schema.Types.Mixed
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
userProgressSchema.index({ userId: 1, gameMode: 1, levelId: 1, questionId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, completed: 1 });
userProgressSchema.index({ completedAt: -1 });

// Methods
userProgressSchema.methods.markCompleted = function(score, timeSpent, solution) {
  this.completed = true;
  this.score = Math.max(this.score, score);
  this.timeSpent += timeSpent;
  this.completedAt = new Date();
  this.solution = solution;
  return this.save();
};

userProgressSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

module.exports = mongoose.model('UserProgress', userProgressSchema);