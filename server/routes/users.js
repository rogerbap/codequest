// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { protect } = require('../middleware/auth');

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user progress
    const progress = await UserProgress.find({ userId });
    
    // Calculate statistics
    const stats = {
      totalQuestions: progress.length,
      completed: progress.filter(p => p.completed).length,
      totalScore: progress.reduce((sum, p) => sum + p.score, 0),
      totalTime: progress.reduce((sum, p) => sum + p.timeSpent, 0),
      averageAttempts: progress.length > 0 ? 
        progress.reduce((sum, p) => sum + p.attempts, 0) / progress.length : 0,
      quickFireStats: {
        completed: progress.filter(p => p.gameMode === 'quickFire' && p.completed).length,
        totalScore: progress.filter(p => p.gameMode === 'quickFire').reduce((sum, p) => sum + p.score, 0)
      },
      careerStats: {
        completed: progress.filter(p => p.gameMode === 'career' && p.completed).length,
        totalScore: progress.filter(p => p.gameMode === 'career').reduce((sum, p) => sum + p.score, 0)
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error getting user statistics'
    });
  }
});

// @desc    Get user achievements
// @route   GET /api/users/achievements
// @access  Private
router.get('/achievements', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const allAchievements = {
      quickFire: user.gameStats.quickFire.achievements,
      career: user.gameStats.career.achievements
    };

    res.status(200).json({
      success: true,
      data: allAchievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error getting achievements'
    });
  }
});

module.exports = router;