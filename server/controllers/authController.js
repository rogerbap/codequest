// server/controllers/authController.js
const AuthService = require('../services/authService');
const { body, validationResult } = require('express-validator');

// Validation rules
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

class AuthController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  async register(req, res) {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const result = await AuthService.register(req.body);

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Set cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('token', result.token, cookieOptions);

      res.status(201).json(result);
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during registration'
      });
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(req, res) {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      // Set cookie
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('token', result.token, cookieOptions);

      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during login'
      });
    }
  }

  // @desc    Logout user
  // @route   POST /api/auth/logout
  // @access  Private
  logout(req, res) {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  }

  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  async getMe(req, res) {
    try {
      res.status(200).json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error getting user'
      });
    }
  }

  // @desc    Update user profile
  // @route   PUT /api/auth/profile
  // @access  Private
  async updateProfile(req, res) {
    try {
      const { displayName, preferences } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update profile
      if (displayName) {
        user.profile.displayName = displayName;
      }

      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }

      await user.save();

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          gameStats: user.gameStats,
          preferences: user.preferences
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error updating profile'
      });
    }
  }
}

// Export controller methods with validation
module.exports = {
  register: [registerValidation, new AuthController().register],
  login: [loginValidation, new AuthController().login],
  logout: new AuthController().logout,
  getMe: new AuthController().getMe,
  updateProfile: new AuthController().updateProfile
};