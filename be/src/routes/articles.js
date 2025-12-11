const express = require('express');
const { body, validationResult } = require('express-validator');
const Article = require('../models/Article');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const articles = await Article.find({}).sort({ createdAt: -1 });
  res.json(articles);
});

router.get('/:id', auth, async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json(article);
});

router.post(
  '/',
  auth,
  requireAdmin,
  [body('title').notEmpty(), body('body').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const article = await Article.create({
      title: req.body.title,
      body: req.body.body,
      author: req.user._id
    });
    res.status(201).json(article);
  }
);

router.put(
  '/:id',
  auth,
  requireAdmin,
  [body('title').optional(), body('body').optional()],
  async (req, res) => {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  }
);

router.delete('/:id', auth, requireAdmin, async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  await article.deleteOne();
  res.json({ message: 'Article deleted' });
});

module.exports = router;

