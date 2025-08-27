// src/components/screens/LevelSelector.jsx
import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Lock, Clock, Target, Star } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';

const LevelSelector = ({ onSelectLevel, onBack }) => {
  const { 
    gameMode, 
    levels, 
    loadLevels, 
    loading, 
    error 
  } = useGame();
  
  const { user } = useAuth();

  // FIXED: Remove loadLevels from dependency array to prevent infinite loop
  useEffect(() => {
    console.log('LevelSelector useEffect called', { gameMode, levelsLength: levels.length, loading, error });
    if (gameMode && levels.length === 0 && !loading && !error) {
      console.log('Loading levels for:', gameMode);
      loadLevels(gameMode);
    }
  }, [gameMode, levels.length, loading, error]); // Removed loadLevels

  const userProgress = user?.gameStats?.[gameMode] || {};
  const unlockedLevels = gameMode === 'career' ? 
    userProgress.unlockedLevels || [1] : 
    levels.map(level => level.levelId);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl">Loading levels...</p>
        <p className="text-gray-400 text-sm mt-2">Loading, this may take a moment.</p>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error loading levels: {error}</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {gameMode === 'quickFire' ? 'Quick Fire Levels' : 'Career Path'}
            </h1>
            <p className="text-gray-300">
              {gameMode === 'quickFire' ? 
                'Choose your starting level - each has multiple debugging challenges!' : 
                'Select an unlocked level to continue your journey'
              }
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.levelId);
            const isCompleted = userProgress.maxLevel > level.levelId;
            
            return (
              <div
                key={level.levelId}
                className={`bg-black/40 backdrop-blur-lg rounded-xl p-6 border transition-all ${
                  isUnlocked 
                    ? 'border-white/10 hover:border-cyan-400/50 cursor-pointer transform hover:scale-105' 
                    : 'border-gray-600/50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isUnlocked && onSelectLevel(level.levelId)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{level.title}</h3>
                  <div className="flex items-center space-x-2">
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {!isUnlocked && <Lock className="w-5 h-5 text-gray-500" />}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(level.difficulty)}`}>
                      {level.difficulty}
                    </span>
                    {gameMode === 'career' && level.category && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        {level.category}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm">{level.description}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-cyan-400 font-mono text-sm flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>+{level.points} pts</span>
                      </span>
                      <span className="text-orange-400 text-sm flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>{level.questionCount} questions</span>
                      </span>
                    </div>
                    {gameMode === 'quickFire' && level.timeLimit && (
                      <span className="text-red-400 text-sm flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{level.timeLimit}s</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;