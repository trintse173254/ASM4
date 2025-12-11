require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Article = require('../models/Article');

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Quiz.deleteMany({}),
    Question.deleteMany({}),
    Article.deleteMany({})
  ]);

  const admin = await User.create({ username: 'admin', password: 'admin123', isAdmin: true });
  const user = await User.create({ username: 'john', password: 'john123', isAdmin: false });

  const quiz = await Quiz.create({ title: 'General Knowledge', description: 'Basics' });
  const questionsData = [
    {
      quiz: quiz._id,
      text: 'What is the capital of Germany?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctIndex: 2
    },
    {
      quiz: quiz._id,
      text: 'Who developed the theory of relativity?',
      options: ['Einstein', 'Newton', 'Tesla', 'Galileo'],
      correctIndex: 0
    }
  ];
  const questions = await Question.insertMany(questionsData);
  quiz.questions = questions.map((q) => q._id);
  await quiz.save();

  await Article.create({
    title: 'Welcome to the Quiz App',
    body: 'This is a demo article. Feel free to extend it.',
    author: admin._id
  });

  console.log('Seed completed', { admin: admin.username, user: user.username });
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

