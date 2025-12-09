const Feedback = require('../models/Feedback');

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Private
const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email');
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new feedback
// @route   POST /api/feedbacks
// @access  Private
const createFeedback = async (req, res) => {
    const { title, description, category, priority } = req.body;

    try {
        if (!title || !description || !category || !priority) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const feedback = await Feedback.create({
            title,
            description,
            category,
            priority,
            submittedBy: req.user.id,
            status: 'Submitted'
        });

        const populatedFeedback = await Feedback.findById(feedback._id).populate('submittedBy', 'name email');

        res.status(201).json(populatedFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
        if (req.body.status) feedback.status = req.body.status;
        if (req.body.assignedTo !== undefined) feedback.assignedTo = req.body.assignedTo;

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

        await feedback.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Feedback deleted' });
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
    deleteFeedback
};
