// server/routes/game.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { protect } = require('../middleware/auth');
const { submitLimiter } = require('../middleware/rateLimiter');

// All game routes require authentication
router.use(protect);

router.get('/levels/:gameMode', gameController.getLevels);
router.get('/questions/:gameMode/:levelId', gameController.getQuestions);
router.post('/submit', submitLimiter, gameController.submitSolution);
router.get('/progress/:gameMode', gameController.getProgress);
router.get('/leaderboard/:gameMode', gameController.getLeaderboard);

module.exports = router;