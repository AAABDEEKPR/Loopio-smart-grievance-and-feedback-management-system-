import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from './AuthProvider';
import './FeedbackDetail.css';

const FeedbackDetail = ({ feedback, onClose }) => {
    const { addComment } = useFeedback();
    const { user: currentUser } = useAuth();
    const [commentText, setCommentText] = useState('');

    const assignedDev = feedback.assignedTo; // Populated object or null

    const handleSendComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        addComment(feedback._id, {
            text: commentText,
            author: currentUser.name,
            role: currentUser.role
        });
        setCommentText('');
    };

    return (
        <div className="feedback-detail-overlay">
            <div className="feedback-detail-modal">
                <div className="detail-header">
                    <div className="header-left">
                        <span className={`priority-badge ${feedback.priority.toLowerCase()}`}>
                            {feedback.priority} Priority
                        </span>
                        <span className={`status-badge ${feedback.status.toLowerCase().replace(' ', '-')}`}>
                            {feedback.status}
                        </span>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="detail-content">
                    <h2>{feedback.title}</h2>
                    <div className="meta-info">
                        <span><strong>Category:</strong> {feedback.category}</span>
                        <span><strong>Submitted by:</strong> {feedback.submittedBy?.name || 'Unknown'}</span>
                        <span><strong>Assigned to:</strong> {assignedDev ? assignedDev.name : 'Unassigned'}</span>
                        <span><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="description-box">
                        <h3>Description</h3>
                        <p>{feedback.description}</p>
                    </div>

                    <div className="comments-section">
                        <h3>Discussion</h3>
                        <div className="comments-list">
                            {feedback.comments.length === 0 ? (
                                <p className="no-comments">No comments yet. Start the discussion!</p>
                            ) : (
                                feedback.comments.map(comment => (
                                    <div key={comment._id || comment.id} className={`comment-bubble ${comment.role === currentUser.role ? 'mine' : 'theirs'}`}>
                                        <div className="comment-header">
                                            <span className="author">{comment.author}</span>
                                            <span className="role-tag">{comment.role}</span>
                                            <span className="time">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p>{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <form className="comment-form" onSubmit={handleSendComment}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackDetail;
