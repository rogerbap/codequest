/ server/seeds/levels.js
const levels = [
  // Quick Fire Levels
  {
    levelId: 1,
    gameMode: 'quickFire',
    title: 'Syntax Basics',
    description: 'Master the fundamentals of JavaScript syntax errors.',
    difficulty: 'Beginner',
    points: 100,
    timeLimit: 120,
    questionIds: [1, 2, 3],
    unlocked: true,
    isActive: true,
    order: 1
  },
  {
    levelId: 2,
    gameMode: 'quickFire',
    title: 'Variable Mysteries',
    description: 'Solve common variable scope and declaration issues.',
    difficulty: 'Beginner',
    points: 150,
    timeLimit: 180,
    questionIds: [1, 2, 3],
    unlocked: false,
    isActive: true,
    order: 2
  },
  
  // Career Levels
  {
    levelId: 1,
    gameMode: 'career',
    title: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript syntax and common beginner mistakes.',
    difficulty: 'Beginner',
    category: 'Syntax Errors',
    points: 120,
    questionIds: [1, 2, 3],
    unlocked: true,
    isActive: true,
    order: 1
  },
  {
    levelId: 2,
    gameMode: 'career',
    title: 'Object Operations',
    description: 'Learn to safely work with JavaScript objects and their properties.',
    difficulty: 'Beginner',
    category: 'Object Manipulation',
    points: 180,
    prerequisites: [1],
    questionIds: [1, 2, 3],
    unlocked: false,
    isActive: true,
    order: 2
  }
];

module.exports = levels;