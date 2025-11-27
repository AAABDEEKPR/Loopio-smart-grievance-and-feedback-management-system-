const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile, getDevelopers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.get('/developers', protect, getDevelopers);

module.exports = router;
