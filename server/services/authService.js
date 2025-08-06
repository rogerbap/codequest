//server/services/authService.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
  }

  // Verify JWT token
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  // Register new user
  async register(userData) {
    try {
      const { username, email, password } = userData;

      // Check if user exists
      let user = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (user) {
        throw new Error('User with this email or username already exists');
      }

      // Create new user
      user = new User({
        username,
        email,
        password
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          gameStats: user.gameStats,
          preferences: user.preferences
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user and include password
      const user = await User.findOne({ email }).select('+password');

      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await user.updateLastLogin();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          gameStats: user.gameStats,
          preferences: user.preferences
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user by token
  async getUserByToken(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new Error('User not found');
      }

      return {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          gameStats: user.gameStats,
          preferences: user.preferences
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AuthService();