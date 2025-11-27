const express = require('express');
const router = express.Router();
const { getFeedbacks, createFeedback, updateFeedback, addComment } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFeedbacks)
    .post(protect, createFeedback);

router.route('/:id')
    .put(protect, updateFeedback);

router.route('/:id/comments')
    .post(protect, addComment);

module.exports = router;
