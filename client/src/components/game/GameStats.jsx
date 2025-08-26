// src/components/game/GameStats.jsx
import React from 'react';
import { Trophy, Target, Star, Clock, Heart, Award } from 'lucide-react';

const GameStats = ({ 
  level, 
  question, 
  totalQuestions, 
  score, 
  lives, 
  timeLeft, 
  achievements, 
  gameMode 
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-semibold">Level {level}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold">Q {question}/{totalQuestions}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">{score} pts</span>
        </div>
        {gameMode === 'quickFire' && (
          <>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className={`font-semibold ${timeLeft < 30 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-400" />
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < lives ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        {achievements.length > 0 && (
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">{achievements.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStats;