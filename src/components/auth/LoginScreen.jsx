// src/components/auth/LoginScreen.jsx
import React, { useState } from 'react';
import { User, LogIn, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const { login, register, loading, error, clearError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!isLogin && (!formData.username || formData.username.length < 3)) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    clearError();

    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.username, formData.email, formData.password);
      }

      if (!result.success) {
        setFormErrors({ submit: result.error });
      }
    } catch (err) {
      setFormErrors({ submit: 'An unexpected error occurred' });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
    setFormErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/10">
        <div className="text-center mb-8">
          <User className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join CodeQuest'}
          </h1>
          <p className="text-gray-300">
            {isLogin ? 'Sign in to continue your debugging journey' : 'Create an account to start debugging'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
                  formErrors.username ? 'border-red-500' : 'border-gray-600 focus:border-cyan-400'
                }`}
                placeholder="Choose a username"
              />
              {formErrors.username && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.username}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
                formErrors.email ? 'border-red-500' : 'border-gray-600 focus:border-cyan-400'
              }`}
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors pr-12 ${
                  formErrors.password ? 'border-red-500' : 'border-gray-600 focus:border-cyan-400'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-400 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formErrors.password}
              </p>
            )}
          </div>

          {(error || formErrors.submit) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error || formErrors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-600 text-center">
          <p className="text-gray-400 text-sm mb-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={toggleMode}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-600">
          <p className="text-gray-400 text-xs text-center">
            Your progress will be saved securely. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;