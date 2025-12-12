const Notification = require('../models/Notification');  
// Import Notification model for DB operations

// @desc Get user notifications
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res) => {
    try {
        console.log('Fetching notifications for user:', req.user.id);

        // Find all notifications where recipient = current user
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 }); // Sort by latest first

        console.log('Found notifications:', notifications.length);

        res.status(200).json(notifications);  
        // Send notifications back to frontend
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });  
        // Generic error response
    }
};

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markAsRead = async (req, res) => {
    try {
        // Find notification by ID from URL params
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            // If no notification found
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Check if this notification belongs to the logged-in user
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });  
            // User trying to access others' notification
        }

        // Mark as read
        notification.read = true;
        await notification.save(); // Save updated notification in DB

        res.status(200).json(notification);  
        // Send updated notification
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });  
        // Generic backend error
    }
};

// Internal Helper to create notification
const createNotification = async (recipientId, message, type = 'info', relatedLink = '') => {
    try {
        // Create and store a new notification
        await Notification.create({
            recipient: recipientId,  // User who will receive it
            message,                 // Notification text
            type,                    // info/warning/success/error
            relatedLink              // Optional link for navigation
        });
    } catch (error) {
        console.error('Notification creation failed:', error);  
        // Log if creation fails
    }
};

module.exports = {
    getNotifications,  // Export fetch function
    markAsRead,        // Export read update function
    createNotification // Export create helper
};
