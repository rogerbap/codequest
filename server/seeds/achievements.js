/ server/seeds/achievements.js
const achievements = [
  {
    key: 'speedRunner',
    name: 'Speed Runner',
    description: 'Complete a level in under 30 seconds',
    icon: '⚡',
    category: 'speed',
    points: 100,
    rarity: 'rare',
    criteria: {
      type: 'completion_time',
      value: 30,
      operator: 'less_than'
    },
    isActive: true
  },
  {
    key: 'noHints',
    name: 'No Hints Needed',
    description: 'Complete a level without using hints',
    icon: '🧠',
    category: 'accuracy',
    points: 75,
    rarity: 'common',
    criteria: {
      type: 'hints_used',
      value: 0,
      operator: 'equals'
    },
    isActive: true
  },
  {
    key: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a level on first try',
    icon: '💎',
    category: 'accuracy',
    points: 150,
    rarity: 'epic',
    criteria: {
      type: 'attempts',
      value: 1,
      operator: 'equals'
    },
    isActive: true
  },
  {
    key: 'allLevels',
    name: 'Bug Squasher',
    description: 'Complete all levels',
    icon: '🏆',
    category: 'progress',
    points: 500,
    rarity: 'legendary',
    criteria: {
      type: 'levels_completed',
      value: 'all',
      operator: 'equals'
    },
    isActive: true
  },
  {
    key: 'timeBonus',
    name: 'Time Master',
    description: 'Complete level with time bonus',
    icon: '⏰',
    category: 'speed',
    points: 50,
    rarity: 'common',
    criteria: {
      type: 'time_bonus',
      value: true,
      operator: 'equals'
    },
    isActive: true
  }
];

module.exports = achievements;