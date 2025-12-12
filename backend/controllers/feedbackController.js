const Feedback = require('../models/Feedback');
const { createNotification } = require('./notificationController');
const fs = require('fs');
const path = require('path');

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Private
const getFeedbacks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.status) query.status = req.query.status;
        if (req.query.category) query.category = req.query.category;
        if (req.query.priority) query.priority = req.query.priority;
        if (req.query.submittedBy) query.submittedBy = req.query.submittedBy;

        // Advanced Search
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // ROLE BASED ACCESS CONTROL
        // If user is not admin/developer, they can only see their own feedbacks
        if (req.user.role === 'user') {
            query.submittedBy = req.user.id;
        } else if (req.query.submittedBy) {
            // Admins/Devs can filter by user
            query.submittedBy = req.query.submittedBy;
        }

        const feedbacks = await Feedback.find(query)
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Feedback.countDocuments(query);

        res.status(200).json({
            feedbacks,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new feedback
// @route   POST /api/feedbacks
// @access  Private
const createFeedback = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        if (!title || !description || !category || !priority) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        let attachment = null;
        if (req.file) {
            attachment = req.file.path.replace(/\\/g, "/"); // Normalize path for Windows
        }

        const feedback = new Feedback({
            title,
            description,
            category,
            priority,
            submittedBy: req.user.id, // Assuming req.user.id is the correct user ID field
            status: 'Submitted',
            attachment // Save file path
        });

        const createdFeedback = await feedback.save();

        // Populate author details for immediate UI update
        const populatedFeedback = await Feedback.findById(createdFeedback._id).populate('submittedBy', 'name email');

        res.status(201).json(populatedFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update feedback status/assignment
// @route   PUT /api/feedbacks/:id
// @access  Private (Dev/Admin)
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Update fields
        if (req.body.title) feedback.title = req.body.title;
        if (req.body.description) feedback.description = req.body.description;
        if (req.body.category) feedback.category = req.body.category;
        if (req.body.priority) feedback.priority = req.body.priority;
        if (req.body.category) feedback.category = req.body.category;
        if (req.body.priority) feedback.priority = req.body.priority;
        if (req.body.estimatedResolutionDate) feedback.estimatedResolutionDate = req.body.estimatedResolutionDate;

        // Status Change Notification
        if (req.body.status && req.body.status !== feedback.status) {
            feedback.status = req.body.status;
            await createNotification(
                feedback.submittedBy,
                `Your feedback "${feedback.title}" status updated to ${feedback.status}`,
                'info',
                `/feedbacks/${feedback._id}`
            );
        }

        // Assignment Change Notification
        if (req.body.assignedTo && req.body.assignedTo !== feedback.assignedTo?.toString()) {
            feedback.assignedTo = req.body.assignedTo;
            await createNotification(
                feedback.assignedTo,
                `You have been assigned to feedback "${feedback.title}"`,
                'alert',
                `/feedbacks/${feedback._id}`
            );
        }

        const updatedFeedback = await feedback.save();
        const populatedFeedback = await Feedback.findById(updatedFeedback._id)
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email');

        res.status(200).json(populatedFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add comment
// @route   POST /api/feedbacks/:id/comments
// @access  Private
const addComment = async (req, res) => {
    const { text } = req.body;

    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        const comment = {
            text,
            author: req.user.name,
            authorId: req.user.id,
            role: req.user.role
        };

        feedback.comments.push(comment);
        await feedback.save();

        res.status(200).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedbacks/:id
// @access  Private (Owner/Admin)
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check if user is owner or admin
        if (feedback.submittedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to delete this feedback' });
        }

        // Delete attached file if exists
        if (feedback.attachment) {
            const filePath = path.join(__dirname, '..', feedback.attachment);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Failed to delete local file:', err);
                    else console.log('Deleted local file:', filePath);
                });
            }
        }

        await feedback.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Feedback deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete comment
// @route   DELETE /api/feedbacks/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Find comment
        const comment = feedback.comments.find(c => c._id.toString() === req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check permission (Author or Admin)
        if (comment.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove comment
        feedback.comments = feedback.comments.filter(c => c._id.toString() !== req.params.commentId);

        await feedback.save();

        res.status(200).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get Feedback Analytics
// @route   GET /api/feedbacks/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const totalFeedbacks = await Feedback.countDocuments();

        const statusCounts = await Feedback.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const priorityCounts = await Feedback.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        const categoryCounts = await Feedback.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Helper to format aggregation result to object
        const formatConfig = (arr) => {
            const acc = {};
            arr.forEach(item => {
                acc[item._id] = item.count;
            });
            return acc;
        };

        res.status(200).json({
            total: totalFeedbacks,
            status: formatConfig(statusCounts),
            priority: formatConfig(priorityCounts),
            category: formatConfig(categoryCounts)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getFeedbacks,
    createFeedback,
    updateFeedback,
    addComment,
    deleteFeedback,
    deleteComment,
    getAnalytics
};
