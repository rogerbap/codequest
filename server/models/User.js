const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profile: {
    displayName: {
      type: String,
      default: function() { return this.username; }
    },
    avatar: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  gameStats: {
    quickFire: {
      maxLevel: { type: Number, default: 1 },
      maxQuestion: { type: Number, default: 1 },
      totalScore: { type: Number, default: 0 },
      achievements: [{ type: String }],
      completedLevels: [{ type: Number }],
      bestTimes: {
        type: Map,
        of: Number,
        default: new Map()
      }
    },
    career: {
      maxLevel: { type: Number, default: 1 },
      maxQuestion: { type: Number, default: 1 },
      totalScore: { type: Number, default: 0 },
      achievements: [{ type: String }],
      unlockedLevels: { type: [Number], default: [1] },
      progress: {
        type: Map,
        of: {
          completed: Boolean,
          score: Number,
          attempts: Number,
          lastAttempt: Date
        },
        default: new Map()
      }
    }
  },
  preferences: {
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    notifications: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.profile.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
