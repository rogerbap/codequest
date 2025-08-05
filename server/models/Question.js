// server/models/Question.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: [mongoose.Schema.Types.Mixed],
  expected: mongoose.Schema.Types.Mixed,
  description: {
    type: String,
    required: true
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true
  },
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
    required: [true, 'Question title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Question description is required']
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
  brokenCode: {
    type: String,
    required: [true, 'Broken code is required']
  },
  fixedCode: {
    type: String,
    required: [true, 'Fixed code is required']
  },
  testCases: {
    type: [testCaseSchema],
    required: true,
    validate: {
      validator: function(testCases) {
        return testCases && testCases.length > 0;
      },
      message: 'At least one test case is required'
    }
  },
  hint: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: [1, 'Points must be positive']
  },
  isAsync: {
    type: Boolean,
    default: false
  },
  tags: [{ type: String }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
questionSchema.index({ gameMode: 1, levelId: 1, questionId: 1 });
questionSchema.index({ difficulty: 1, category: 1 });
questionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', questionSchema);