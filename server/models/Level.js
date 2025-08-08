// server/models/Level.js
const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  levelId: {
    type: Number,
    required: true
  },
  gameMode: {
    type: String,
    enum: ['quickFire', 'career'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Level title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Level description is required']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  category: {
    type: String,
    required: function() {
      return this.gameMode === 'career';
    }
  },
  points: {
    type: Number,
    required: true,
    min: [1, 'Points must be positive']
  },
  timeLimit: {
    type: Number,
    required: function() {
      return this.gameMode === 'quickFire';
    },
    min: [30, 'Time limit must be at least 30 seconds']
  },
  prerequisites: [{
    type: Number,
    validate: {
      validator: function(levelId) {
        return levelId < this.levelId;
      },
      message: 'Prerequisite level must be lower than current level'
    }
  }],
  questionIds: [{
    type: Number,
    required: true
  }],
  unlocked: {
    type: Boolean,
    default: function() {
      return this.levelId === 1;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for question count
levelSchema.virtual('questionCount').get(function() {
  return this.questionIds ? this.questionIds.length : 0;
});

// Compound unique index: levelId should be unique within each gameMode
levelSchema.index({ gameMode: 1, levelId: 1 }, { unique: true });

// Other indexes
levelSchema.index({ gameMode: 1, order: 1 });
levelSchema.index({ difficulty: 1, category: 1 });

module.exports = mongoose.model('Level', levelSchema);