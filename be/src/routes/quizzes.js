const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public list (requires auth to align with requirements)
router.get('/', auth, async (req, res) => {
  const quizzes = await Quiz.find({}).select('title description');
  res.json(quizzes);
});

router.get('/:id', auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json(quiz);
});

router.post(
  '/',
  auth,
  requireAdmin,
  [body('title').notEmpty(), body('description').optional()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const quiz = await Quiz.create({ title: req.body.title, description: req.body.description });
    res.status(201).json(quiz);
  }
);

router.put(
  '/:id',
  auth,
  requireAdmin,
  [body('title').optional(), body('description').optional()],
  async (req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  }
);

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  await Question.deleteMany({ _id: { $in: quiz.questions } });
  await quiz.deleteOne();
  res.json({ message: 'Quiz deleted' });
});

module.exports = router;

