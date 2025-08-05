/ server/controllers/gameController.js
const Question = require('../models/Question');
const Level = require('../models/Level');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const { body, validationResult, param } = require('express-validator');

class GameController {
  // @desc    Get levels for a game mode
  // @route   GET /api/game/levels/:gameMode
  // @access  Private
  async getLevels(req, res) {
    try {
      const { gameMode } = req.params;
      const userId = req.user.id;

      // Get user progress to determine unlocked levels
      const user = await User.findById(userId);
      const unlockedLevels = gameMode === 'career' ? 
        user.gameStats.career.unlockedLevels : 
        null;

      const levels = await Level.find({ 
        gameMode, 
        isActive: true 
      }).sort({ order: 1 });

      // Add unlock status
      const levelsWithStatus = levels.map(level => ({
        ...level.toObject(),
        unlocked: gameMode === 'quickFire' ? true : unlockedLevels.includes(level.levelId)
      }));

      res.status(200).json({
        success: true,
        data: levelsWithStatus
      });
    } catch (error) {
      console.error('Get levels error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error getting levels'
      });
    }
  }

  // @desc    Get questions for a level
  // @route   GET /api/game/questions/:gameMode/:levelId
  // @access  Private
  async getQuestions(req, res) {
    try {
      const { gameMode, levelId } = req.params;

      const questions = await Question.find({
        gameMode,
        levelId: parseInt(levelId),
        isActive: true
      }).sort({ questionId: 1 });

      if (!questions.length) {
        return res.status(404).json({
          success: false,
          error: 'No questions found for this level'
        });
      }

      res.status(200).json({
        success: true,
        data: questions
      });
    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error getting questions'
      });
    }
  }

  // @desc    Submit solution
  // @route   POST /api/game/submit
  // @access  Private
  async submitSolution(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { gameMode, levelId, questionId, code, score, timeSpent, hintsUsed } = req.body;
      const userId = req.user.id;

      // Find or create user progress
      let progress = await UserProgress.findOne({
        userId,
        gameMode,
        levelId,
        questionId
      });

      if (!progress) {
        progress = new UserProgress({
          userId,
          gameMode,
          levelId,
          questionId
        });
      }

      // Update progress
      await progress.incrementAttempts();
      await progress.markCompleted(score, timeSpent, code);
      progress.hintsUsed += hintsUsed;

      // Update user stats
      const user = await User.findById(userId);
      const gameStats = user.gameStats[gameMode];
      
      gameStats.totalScore = Math.max(gameStats.totalScore, gameStats.totalScore + score);
      gameStats.maxLevel = Math.max(gameStats.maxLevel, levelId);
      gameStats.maxQuestion = Math.max(gameStats.maxQuestion, questionId);

      // Unlock next level in career mode
      if (gameMode === 'career') {
        const nextLevelId = levelId + 1;
        const nextLevel = await Level.findOne({ gameMode, levelId: nextLevelId });
        
        if (nextLevel && !gameStats.unlockedLevels.includes(nextLevelId)) {
          gameStats.unlockedLevels.push(nextLevelId);
        }
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Solution submitted successfully',
        progress: progress.toObject(),
        updatedStats: user.gameStats
      });
    } catch (error) {
      console.error('Submit solution error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error submitting solution'
      });
    }
  }

  // @desc    Get user progress
  // @route   GET /api/game/progress/:gameMode
  // @access  Private
  async getProgress(req, res) {
    try {
      const { gameMode } = req.params;
      const userId = req.user.id;

      const progress = await UserProgress.find({
        userId,
        gameMode
      }).sort({ levelId: 1, questionId: 1 });

      const user = await User.findById(userId);

      res.status(200).json({
        success: true,
        data: {
          progress,
          stats: user.gameStats[gameMode]
        }
      });
    } catch (error) {
      console.error('Get progress error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error getting progress'
      });
    }
  }

  // @desc    Get leaderboard
  // @route   GET /api/game/leaderboard/:gameMode
  // @access  Private
  async getLeaderboard(req, res) {
    try {
      const { gameMode } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      const users = await User.find({ isActive: true })
        .sort({ [`gameStats.${gameMode}.totalScore`]: -1 })
        .limit(limit)
        .select('username profile gameStats');

      const leaderboard = users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        displayName: user.profile.displayName,
        score: user.gameStats[gameMode].totalScore,
        level: user.gameStats[gameMode].maxLevel,
        achievements: user.gameStats[gameMode].achievements.length
      }));

      res.status(200).json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error getting leaderboard'
      });
    }
  }
}

// Validation rules
const submitSolutionValidation = [
  body('gameMode').isIn(['quickFire', 'career']).withMessage('Invalid game mode'),
  body('levelId').isInt({ min: 1 }).withMessage('Level ID must be a positive integer'),
  body('questionId').isInt({ min: 1 }).withMessage('Question ID must be a positive integer'),
  body('code').notEmpty().withMessage('Code is required'),
  body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
  body('timeSpent').isInt({ min: 0 }).withMessage('Time spent must be a non-negative integer'),
  body('hintsUsed').isInt({ min: 0 }).withMessage('Hints used must be a non-negative integer')
];

const gameModeValidation = [
  param('gameMode').isIn(['quickFire', 'career']).withMessage('Invalid game mode')
];

const controller = new GameController();

module.exports = {
  getLevels: [gameModeValidation, controller.getLevels],
  getQuestions: [
    param('gameMode').isIn(['quickFire', 'career']).withMessage('Invalid game mode'),
    param('levelId').isInt({ min: 1 }).withMessage('Level ID must be a positive integer'),
    controller.getQuestions
  ],
  submitSolution: [submitSolutionValidation, controller.submitSolution],
  getProgress: [gameModeValidation, controller.getProgress],
  getLeaderboard: [gameModeValidation, controller.getLeaderboard]
};
