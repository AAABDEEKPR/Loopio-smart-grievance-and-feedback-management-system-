const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile, getDevelopers, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.get('/developers', protect, getDevelopers);

// Forgot Password
router.post('/forgotpassword', forgotPassword);

// Reset Password
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
