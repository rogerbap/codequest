// src/contexts/GameContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import gameService from '../services/gameService';

const GameContext = createContext();

const initialState = {
  gameMode: null,
  currentLevel: 1,
  currentQuestion: 1,
  score: 0,
  lives: 3,
  timeLeft: 0,
  achievements: [],
  streakCount: 0,
  userCode: '',
  testResults: [],
  feedback: '',
  isCorrect: false,
  showHint: false,
  hintUsed: false,
  attempts: 0,
  startTime: null,
  levels: [],
  questions: [],
  loading: false,
  error: null
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GAME_MODE':
      return {
        ...state,
        gameMode: action.payload,
        currentLevel: 1,
        currentQuestion: 1
      };
    case 'SET_LEVEL':
      return {
        ...state,
        currentLevel: action.payload,
        currentQuestion: 1
      };
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
        userCode: action.code || '',
        showHint: false,
        feedback: '',
        isCorrect: false,
        testResults: [],
        startTime: Date.now(),
        hintUsed: false,
        attempts: 0
      };
    case 'UPDATE_CODE':
      return {
        ...state,
        userCode: action.payload
      };
    case 'SET_FEEDBACK':
      return {
        ...state,
        feedback: action.payload.message,
        isCorrect: action.payload.correct,
        testResults: action.payload.results || []
      };
    case 'INCREMENT_ATTEMPTS':
      return {
        ...state,
        attempts: state.attempts + 1
      };
    case 'USE_HINT':
      return {
        ...state,
        showHint: true,
        hintUsed: true
      };
    case 'UPDATE_SCORE':
      return {
        ...state,
        score: state.score + action.payload
      };
    case 'UPDATE_LIVES':
      return {
        ...state,
        lives: Math.max(0, state.lives + action.payload)
      };
    case 'SET_TIME':
      return {
        ...state,
        timeLeft: action.payload
      };
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
        score: state.score + 50
      };
    case 'UPDATE_STREAK':
      return {
        ...state,
        streakCount: action.payload
      };
    case 'SET_LEVELS':
      return {
        ...state,
        levels: action.payload
      };
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        gameMode: state.gameMode
      };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load levels for game mode
  const loadLevels = async (gameMode) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const levels = await gameService.getLevels(gameMode);
      dispatch({ type: 'SET_LEVELS', payload: levels });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Load questions for level
  const loadQuestions = async (gameMode, levelId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const questions = await gameService.getQuestions(gameMode, levelId);
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Submit solution
  const submitSolution = async (solutionData) => {
    try {
      const result = await gameService.submitSolution(solutionData);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Game actions
  const setGameMode = (mode) => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
  };

  const setLevel = (levelId) => {
    dispatch({ type: 'SET_LEVEL', payload: levelId });
  };

  const setQuestion = (questionId, code) => {
    dispatch({ type: 'SET_QUESTION', payload: questionId, code });
  };

  const updateCode = (code) => {
    dispatch({ type: 'UPDATE_CODE', payload: code });
  };

  const setFeedback = (message, correct, results) => {
    dispatch({ type: 'SET_FEEDBACK', payload: { message, correct, results } });
  };

  const incrementAttempts = () => {
    dispatch({ type: 'INCREMENT_ATTEMPTS' });
  };

  const useHint = () => {
    dispatch({ type: 'USE_HINT' });
  };

  const updateScore = (points) => {
    dispatch({ type: 'UPDATE_SCORE', payload: points });
  };

  const updateLives = (change) => {
    dispatch({ type: 'UPDATE_LIVES', payload: change });
  };

  const setTimeLeft = (time) => {
    dispatch({ type: 'SET_TIME', payload: time });
  };

  const addAchievement = (achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  const updateStreak = (count) => {
    dispatch({ type: 'UPDATE_STREAK', payload: count });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const value = {
    ...state,
    loadLevels,
    loadQuestions,
    submitSolution,
    setLevel,
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
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
