const express = require('express');
const router = express.Router();
const { getAllUsers, changePassword, deleteMyAccount } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin only: Get all users
router.get('/', protect, authorize('admin'), getAllUsers);

// Private: Change Password
router.put('/password', protect, changePassword);

// Private: Delete Account
router.delete('/me', protect, deleteMyAccount);

module.exports = router;
