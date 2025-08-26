// src/components/game/AchievementNotification.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const AchievementNotification = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in-right max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{achievement.icon}</span>
          <div>
            <div className="font-bold text-lg">{achievement.name}</div>
            <div className="text-sm opacity-90">{achievement.description}</div>
            <div className="text-xs mt-1 opacity-75">+50 bonus points!</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;