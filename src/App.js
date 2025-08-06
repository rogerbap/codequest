// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider, useGame } from './contexts/GameContext';
import LoginScreen from './components/auth/LoginScreen';
import GameModeSelector from './components/screens/GameModeSelector';
import LevelSelector from './components/screens/LevelSelector';
import GameScreen from './components/screens/GameScreen';
import LoadingSpinner from './components/ui/LoadingSpinner';
// import React from 'react';
import './index.css';

const AppContent = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { gameMode, currentLevel, setGameMode, resetGame } = useGame();
  
  const [currentScreen, setCurrentScreen] = useState('loading');

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        if (gameMode && currentLevel) {
          setCurrentScreen('game');
        } else if (gameMode) {
          setCurrentScreen('levelSelect');
        } else {
          setCurrentScreen('modeSelect');
        }
      } else {
        setCurrentScreen('login');
      }
    }
  }, [isAuthenticated, authLoading, gameMode, currentLevel]);

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setCurrentScreen('levelSelect');
  };

  const handleLevelSelect = (levelId) => {
    setCurrentScreen('game');
  };

  const handleBackToModeSelect = () => {
    resetGame();
    setCurrentScreen('modeSelect');
  };

  const handleBackToLevelSelect = () => {
    setCurrentScreen('levelSelect');
  };

  if (authLoading || currentScreen === 'loading') {
    return <LoadingSpinner />;
  }

  switch (currentScreen) {
    case 'login':
      return <LoginScreen />;
    
    case 'modeSelect':
      return (
        <GameModeSelector 
          onSelectMode={handleModeSelect}
          userProgress={user?.gameStats}
        />
      );
    
    case 'levelSelect':
      return (
        <LevelSelector
          onSelectLevel={handleLevelSelect}
          onBack={handleBackToModeSelect}
        />
      );
    
    case 'game':
      return (
        <GameScreen
          onBack={handleBackToLevelSelect}
          onHome={handleBackToModeSelect}
        />
      );
    
    default:
      return <LoadingSpinner />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <div className="App">
          <AppContent />
        </div>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;