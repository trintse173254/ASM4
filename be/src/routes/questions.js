const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/:quizId',
  auth,
  requireAdmin,
  [
    body('text').notEmpty(),
    body('options').isArray({ min: 2 }),
    body('correctIndex').isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const question = await Question.create({
      quiz: quiz._id,
      text: req.body.text,
      options: req.body.options,
      correctIndex: req.body.correctIndex
    });
    quiz.questions.push(question._id);
    await quiz.save();
    res.status(201).json(question);
  }
);

router.put(
  '/:id',
  auth,
  requireAdmin,
  [
    body('text').optional(),
    body('options').optional().isArray({ min: 2 }),
    body('correctIndex').optional().isInt({ min: 0 })
  ],
  async (req, res) => {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  }
);

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question not found' });
  await Quiz.findByIdAndUpdate(question.quiz, { $pull: { questions: question._id } });
  await question.deleteOne();
  res.json({ message: 'Question deleted' });
});

module.exports = router;

