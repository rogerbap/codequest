/ src/services/gameService.js
import api from './api';

class GameService {
  // Get levels for game mode
  async getLevels(gameMode) {
    try {
      const response = await api.get(`/game/levels/${gameMode}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load levels');
    }
  }

  // Get questions for level
  async getQuestions(gameMode, levelId) {
    try {
      const response = await api.get(`/game/questions/${gameMode}/${levelId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load questions');
    }
  }

  // Submit solution
  async submitSolution(solutionData) {
    try {
      const response = await api.post('/game/submit', solutionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit solution');
    }
  }

  // Get user progress
  async getProgress(gameMode) {
    try {
      const response = await api.get(`/game/progress/${gameMode}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load progress');
    }
  }

  // Get leaderboard
  async getLeaderboard(gameMode, limit = 10) {
    try {
      const response = await api.get(`/game/leaderboard/${gameMode}?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to load leaderboard');
    }
  }
}

export default new GameService();
