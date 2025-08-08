// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider, useGame } from './contexts/GameContext';
import LoginScreen from './components/auth/LoginScreen';
import GameModeSelector from './components/screens/GameModeSelector';
import LevelSelector from './components/screens/LevelSelector';
import GameScreen from './components/screens/GameScreen';
import LoadingSpinner from './components/ui/LoadingSpinner';
import './index.css';

const AppContent = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { gameMode, currentLevel, setGameMode, resetGame, setLevel } = useGame();
 
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [selectedLevel, setSelectedLevel] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        // Determine screen based on game state
        if (gameMode && selectedLevel) {
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
  }, [isAuthenticated, authLoading, gameMode, selectedLevel]);

  const handleModeSelect = (mode) => {
    console.log('App: Mode selected:', mode);
    setGameMode(mode);
    setSelectedLevel(null); // Reset selected level
    setCurrentScreen('levelSelect');
  };

  const handleLevelSelect = (levelId) => {
    console.log('App: Level selected:', levelId);
    setLevel(levelId);
    setSelectedLevel(levelId);
    setCurrentScreen('game');
  };

  const handleBackToModeSelect = () => {
    console.log('App: Back to mode select');
    resetGame();
    setSelectedLevel(null);
    setCurrentScreen('modeSelect');
  };

  const handleBackToLevelSelect = () => {
    console.log('App: Back to level select');
    setSelectedLevel(null);
    setCurrentScreen('levelSelect');
  };

  if (authLoading || currentScreen === 'loading') {
    return <LoadingSpinner />;
  }

  console.log('App: Current screen:', currentScreen, { gameMode, selectedLevel });

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