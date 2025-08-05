/ server/seeds/index.js
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

    // Clear existing data
    console.log('Clearing existing data...');
    await Question.deleteMany({});
    await Level.deleteMany({});
    await Achievement.deleteMany({});

    // Seed questions
    console.log('Seeding questions...');
    await Question.insertMany([...quickFireQuestions, ...careerQuestions]);
    console.log(`${quickFireQuestions.length + careerQuestions.length} questions seeded`);

    // Seed levels
    console.log('Seeding levels...');
    await Level.insertMany(levels);
    console.log(`${levels.length} levels seeded`);

    // Seed achievements
    console.log('Seeding achievements...');
    await Achievement.insertMany(achievements);
    console.log(`${achievements.length} achievements seeded`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;