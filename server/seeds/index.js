// server/seeds/index.js
const mongoose = require('mongoose');
const Question = require('../models/Question');
const Level = require('../models/Level');
const Achievement = require('../models/Achievement');
require('dotenv').config();

// Import seed data
const quickFireQuestions = require('./quickFireQuestions');
const careerQuestions = require('./careerQuestions');
const levels = require('./levels');
const achievements = require('./achievements');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data with proper error handling
    console.log('Clearing existing data...');
    
    try {
      await Question.deleteMany({});
      console.log('Questions cleared');
    } catch (err) {
      console.log('Error clearing questions:', err.message);
    }

    try {
      await Level.deleteMany({});
      console.log('Levels cleared');
    } catch (err) {
      console.log('Error clearing levels:', err.message);
    }

    try {
      await Achievement.deleteMany({});
      console.log('Achievements cleared');
    } catch (err) {
      console.log('Error clearing achievements:', err.message);
    }

    // Seed questions
    console.log('Seeding questions...');
    try {
      const allQuestions = [...quickFireQuestions, ...careerQuestions];
      await Question.insertMany(allQuestions);
      console.log(`${allQuestions.length} questions seeded successfully`);
    } catch (err) {
      console.error('Error seeding questions:', err.message);
    }

    // Seed levels
    console.log('Seeding levels...');
    try {
      await Level.insertMany(levels);
      console.log(`${levels.length} levels seeded successfully`);
    } catch (err) {
      console.error('Error seeding levels:', err.message);
    }

    // Seed achievements
    console.log('Seeding achievements...');
    try {
      await Achievement.insertMany(achievements);
      console.log(`${achievements.length} achievements seeded successfully`);
    } catch (err) {
      console.error('Error seeding achievements:', err.message);
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;