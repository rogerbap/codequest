
// src/components/screens/GameModeSelector.jsx
import React from 'react';
import { Flame, BookOpen, LogOut, Trophy, Clock, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const GameModeSelector = ({ onSelectMode, userProgress }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 max-w-4xl w-full border border-white/10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Welcome back, <span className="text-cyan-400">{user?.username}</span>!
                        </h1>
                        <p className="text-gray-300">Choose your debugging adventure</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Quick Fire Mode */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-red-400/50 transition-colors group">
                        <div className="flex items-center space-x-3 mb-4">
                            <Flame className="w-8 h-8 text-red-400" />
                            <h2 className="text-2xl font-bold text-white">Quick Fire Mode</h2>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Fast-paced debugging challenges with time pressure. Multiple questions per level!
                        </p>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Best Score:</span>
                                <span className="text-red-400 font-bold">
                                    {userProgress?.quickFire?.totalScore || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Achievements:</span>
                                <span className="text-red-400 font-bold">
                                    {userProgress?.quickFire?.achievements?.length || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Max Level:</span>
                                <span className="text-red-400 font-bold">
                                    {userProgress?.quickFire?.maxLevel || 1}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Timed</span>
                            </span>
                            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center space-x-1">
                                <Flame className="w-3 h-3" />
                                <span>Multi-Question</span>
                            </span>
                            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center space-x-1">
                                <Target className="w-3 h-3" />
                                <span>3 Lives</span>
                            </span>
                        </div>

                        <button
                            onClick={() => onSelectMode('quickFire')}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform group-hover:scale-105"
                        >
                            Start Quick Fire
                        </button>
                    </div>

                    {/* Career Mode */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-400/50 transition-colors group">
                        <div className="flex items-center space-x-3 mb-4">
                            <BookOpen className="w-8 h-8 text-blue-400" />
                            <h2 className="text-2xl font-bold text-white">Career Mode</h2>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Progressive learning path with saved progress. Multiple questions per level to master each concept.
                        </p>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Current Level:</span>
                                <span className="text-blue-400 font-bold">
                                    {userProgress?.career?.maxLevel || 1}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Total Score:</span>
                                <span className="text-blue-400 font-bold">
                                    {userProgress?.career?.totalScore || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Achievements:</span>
                                <span className="text-blue-400 font-bold">
                                    {userProgress?.career?.achievements?.length || 0}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center space-x-1">
                                <BookOpen className="w-3 h-3" />
                                <span>Educational</span>
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center space-x-1">
                                <Trophy className="w-3 h-3" />
                                <span>Progressive</span>
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center space-x-1">
                                <Target className="w-3 h-3" />
                                <span>Categories</span>
                            </span>
                        </div>

                        <button
                            onClick={() => onSelectMode('career')}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform group-hover:scale-105"
                        >
                            Continue Career
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameModeSelector;
