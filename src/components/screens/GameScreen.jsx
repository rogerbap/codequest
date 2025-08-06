// src/components/screens/GameScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  EyeOff, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Save, 
  SkipForward,
  ArrowLeft,
  Home,
  Flame
} from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import GameStats from '../game/GameStats';
import CodeEditor from '../game/CodeEditor';
import TestResults from '../game/TestResults';
import AchievementNotification from '../game/AchievementNotification';
import codeExecutor from '../../services/codeExecutor';

const GameScreen = ({ onBack, onHome }) => {
  const {
    gameMode,
    currentLevel,
    currentQuestion,
    score,
    lives,
    timeLeft,
    achievements,
    streakCount,
    userCode,
    testResults,
    feedback,
    isCorrect,
    showHint,
    hintUsed,
    attempts,
    questions,
    loadQuestions,
    setQuestion,
    updateCode,
    setFeedback,
    incrementAttempts,
    useHint,
    updateScore,
    updateLives,
    setTimeLeft,
    addAchievement,
    updateStreak,
    submitSolution,
    loading,
    error
  } = useGame();

  const { user } = useAuth();
  
  const [showTests, setShowTests] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const currentQuestionData = questions[currentQuestion - 1];
  const totalQuestions = questions.length;

  // Memoize the time up handler to prevent recreation on every render
  const handleTimeUp = useCallback(() => {
    if (gameMode === 'quickFire') {
      updateLives(-1);
      if (lives <= 1) {
        // Game over logic would go here
        onBack(); // For now, go back
      }
    }
  }, [gameMode, updateLives, lives, onBack]);

  // Load questions when level changes
  useEffect(() => {
    if (gameMode && currentLevel && loadQuestions) {
      loadQuestions(gameMode, currentLevel);
    }
  }, [gameMode, currentLevel, loadQuestions]);

  // Set up question when questions load or question changes
  useEffect(() => {
    if (currentQuestionData && setQuestion) {
      setQuestion(currentQuestion, currentQuestionData.brokenCode);
      setStartTime(Date.now());
    }
  }, [currentQuestionData, currentQuestion, setQuestion]);

  // Timer for quick fire mode
  useEffect(() => {
    if (gameMode === 'quickFire' && timeLeft > 0 && setTimeLeft) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft <= 1) {
          handleTimeUp();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameMode, timeLeft, setTimeLeft, handleTimeUp]);

  const checkSolution = async () => {
    if (!currentQuestionData) return;

    incrementAttempts();
    
    // Validate code safety
    const validation = codeExecutor.validateCode(userCode);
    if (!validation.valid) {
      setFeedback(validation.error, false, []);
      return;
    }

    // Execute code
    const executionResult = codeExecutor.executeCode(
      userCode, 
      currentQuestionData.testCases, 
      currentQuestionData.isAsync
    );

    setShowTests(true);
    setFeedback(
      executionResult.success && executionResult.allPassed ? 
        `Perfect! ${currentQuestionData.explanation}` : 
        executionResult.error || 'Some test cases failed. Check the results below.',
      executionResult.success && executionResult.allPassed,
      executionResult.results
    );

    if (executionResult.success && executionResult.allPassed) {
      // Calculate points
      let points = Math.floor(currentQuestionData.points || 50);
      
      // Time bonus for quick fire
      if (gameMode === 'quickFire') {
        const timeBonus = Math.max(0, Math.floor((timeLeft / 120) * 25));
        points += timeBonus;
      }

      updateScore(points);
      updateStreak(streakCount + 1);

      // Check for achievements
      const completionTime = (Date.now() - startTime) / 1000;
      checkAchievements(completionTime);

      // Submit to backend
      try {
        await submitSolution({
          gameMode,
          levelId: currentLevel,
          questionId: currentQuestion,
          code: userCode,
          score: points,
          timeSpent: completionTime,
          hintsUsed: hintUsed ? 1 : 0
        });
      } catch (err) {
        console.error('Failed to submit solution:', err);
      }

      // Move to next question after delay
      setTimeout(() => {
        if (currentQuestion < totalQuestions) {
          setQuestion(currentQuestion + 1);
        } else {
          // Level completed
          onBack(); // For now, go back to level selector
        }
      }, 2000);
    } else {
      updateStreak(0);
      if (gameMode === 'quickFire') {
        updateLives(-1);
        if (lives <= 1) {
          setTimeout(() => onBack(), 1000);
        }
      }
    }
  };

  const checkAchievements = (completionTime) => {
    const newAchievements = [];

    // Speed runner
    if (completionTime < 30 && !achievements.includes('speedRunner')) {
      newAchievements.push('speedRunner');
    }

    // No hints
    if (!hintUsed && !achievements.includes('noHints')) {
      newAchievements.push('noHints');
    }

    // Perfectionist
    if (attempts === 0 && !achievements.includes('perfectionist')) {
      newAchievements.push('perfectionist');
    }

    // Streak master
    if (streakCount >= 2 && !achievements.includes('streak')) {
      newAchievements.push('streak');
    }

    // Award achievements
    newAchievements.forEach(achievementKey => {
      addAchievement(achievementKey);
      // Show notification (simplified)
      setNewAchievement({ 
        name: achievementKey, 
        icon: '🏆', 
        description: 'Achievement unlocked!' 
      });
    });
  };

  const runTests = () => {
    if (!currentQuestionData) return;
    
    const validation = codeExecutor.validateCode(userCode);
    if (!validation.valid) {
      setFeedback(validation.error, false, []);
      return;
    }

    const executionResult = codeExecutor.executeCode(
      userCode, 
      currentQuestionData.testCases, 
      currentQuestionData.isAsync
    );
    
    setShowTests(true);
    setFeedback('Tests executed', false, executionResult.results);
  };

  const skipQuestion = () => {
    if (gameMode === 'career' && currentQuestion < totalQuestions) {
      updateStreak(0);
      setQuestion(currentQuestion + 1);
    }
  };

  const resetCode = () => {
    if (currentQuestionData) {
      updateCode(currentQuestionData.brokenCode);
      setShowTests(false);
      setFeedback('', false, []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuestionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Question not found'}</p>
          <button
            onClick={onBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {newAchievement && (
        <AchievementNotification 
          achievement={newAchievement} 
          onClose={() => setNewAchievement(null)} 
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <GameStats 
          level={currentLevel} 
          question={currentQuestion}
          totalQuestions={totalQuestions}
          score={score} 
          lives={lives} 
          timeLeft={timeLeft}
          achievements={achievements}
          gameMode={gameMode}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Question Panel */}
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{currentQuestionData.title}</h2>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQuestionData.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  currentQuestionData.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {currentQuestionData.difficulty}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">{currentQuestionData.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={useHint}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
                
                <button
                  onClick={runTests}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Run Tests</span>
                </button>

                {gameMode === 'career' && (
                  <button
                    onClick={skipQuestion}
                    className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Skip</span>
                  </button>
                )}
              </div>
              
              {showHint && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-200">{currentQuestionData.hint}</p>
                </div>
              )}
              
              {feedback && (
                <div className={`border rounded-lg p-4 ${
                  isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'Excellent!' : 'Keep Trying'}
                    </span>
                  </div>
                  <p className={isCorrect ? 'text-green-200' : 'text-red-200'}>{feedback}</p>
                </div>
              )}

              {streakCount > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-semibold">
                      {streakCount} question streak! 🔥
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Code Editor */}
          <div className="xl:col-span-2 bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Code Editor</h3>
              <div className="flex space-x-2">
                <button
                  onClick={checkSolution}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Solution</span>
                </button>
                <button
                  onClick={resetCode}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            
            <CodeEditor
              code={userCode}
              onChange={updateCode}
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                {gameMode === 'career' ? 'Fix the code and pass all tests' : 'Fix quickly to maximize points'}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-gray-400 text-sm">
                  Attempts: {attempts}
                </div>
                <div className="text-gray-400 text-sm">
                  Q: {currentQuestion}/{totalQuestions}
                </div>
              </div>
            </div>
            
            <TestResults results={testResults} show={showTests} />
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Level Select</span>
          </button>
          
          <div className="text-center">
            <span className="text-gray-400 text-sm">
              {gameMode === 'quickFire' ? 'Quick Fire Mode' : 'Career Mode'} - Level {currentLevel}
            </span>
            <div className="text-gray-500 text-xs mt-1">
              Question {currentQuestion} of {totalQuestions}
            </div>
          </div>
          
          <button
            onClick={onHome}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;