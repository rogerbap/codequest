// server/routes/questions.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Level = require('../models/Level');
const { protect } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Admin middleware (you can enhance this)
const adminOnly = (req, res, next) => {
  // For now, check if user is admin (you can implement proper admin system)
  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

// @desc    Get all questions (admin only)
// @route   GET /api/questions
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { gameMode, levelId, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (gameMode) query.gameMode = gameMode;
    if (levelId) query.levelId = parseInt(levelId);

    const questions = await Question.find(query)
      .sort({ gameMode: 1, levelId: 1, questionId: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: questions.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error getting questions'
    });
  }
});

// @desc    Create new question (admin only)
// @route   POST /api/questions
// @access  Private/Admin
const createQuestionValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('gameMode').isIn(['quickFire', 'career']).withMessage('Invalid game mode'),
  body('levelId').isInt({ min: 1 }).withMessage('Level ID must be positive integer'),
  body('questionId').isInt({ min: 1 }).withMessage('Question ID must be positive integer'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty'),
  body('brokenCode').notEmpty().withMessage('Broken code is required'),
  body('fixedCode').notEmpty().withMessage('Fixed code is required'),
  body('testCases').isArray({ min: 1 }).withMessage('At least one test case is required'),
  body('hint').notEmpty().withMessage('Hint is required'),
  body('explanation').notEmpty().withMessage('Explanation is required'),
  body('points').isInt({ min: 1 }).withMessage('Points must be positive integer')
];

router.post('/', protect, adminOnly, createQuestionValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const question = new Question(req.body);
    await question.save();

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating question'
    });
  }
});

// @desc    Update question (admin only)
// @route   PUT /api/questions/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating question'
    });
  }
});

// @desc    Delete question (admin only)
// @route   DELETE /api/questions/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    // Soft delete
    question.isActive = false;
    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting question'
    });
  }
});

module.exports = router;