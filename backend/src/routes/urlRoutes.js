const express = require('express');
const {
  shortenUrl,
  getAnalytics,
  getAllUrls,
  deleteUrl
} = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Optional Auth Middleware for shorten URL
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // ignore token error here since it's optional
    }
  }
  next();
};

const shortenSchema = Joi.object({
  originalUrl: Joi.string().uri().required(),
  customAlias: Joi.string().alphanum().min(3).max(30).optional(),
  expiresAt: Joi.date().iso().optional()
});

router.post('/shorten', optionalAuth, validate(shortenSchema), shortenUrl);
router.get('/analytics/:shortCode', getAnalytics);
router.get('/all', getAllUrls);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
