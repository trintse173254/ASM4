const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).trim(),
    body('password').isLength({ min: 4 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password, isAdmin } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ username, password, isAdmin: isAdmin || false });
    const token = signToken(user);
    res.json({ user: { id: user._id, username: user.username, isAdmin: user.isAdmin }, token });
  }
);

router.post(
  '/login',
  [body('username').notEmpty(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ user: { id: user._id, username: user.username, isAdmin: user.isAdmin }, token });
  }
);

module.exports = router;

