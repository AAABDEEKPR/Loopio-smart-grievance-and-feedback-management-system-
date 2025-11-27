import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from './AuthProvider';
import FeedbackForm from './FeedbackForm';
import FeedbackDetail from './FeedbackDetail';
import NotificationBell from './NotificationBell';
import './UserDashboard.css';

const UserDashboard = () => {
    const { feedbacks, updateFeedbackStatus, searchQuery } = useFeedback();
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const myFeedbacks = feedbacks.filter(fb =>
        fb.submittedBy && fb.submittedBy._id === user._id &&
        (fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fb.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCloseFeedback = (id) => {
        if (window.confirm('Are you sure you want to close this feedback?')) {
            updateFeedbackStatus(id, 'Closed');
        }
    };

    return (
        <div className="user-dashboard">
            <header className="dashboard-header">
                <div>
                    <h2>Welcome, {user.name}</h2>
                    <p className="subtitle">Track and manage your requests</p>
                </div>
                <div className="header-actions">
                    <button className="new-feedback-btn" onClick={() => setIsFormOpen(true)}>
                        + New Feedback
                    </button>
                </div>
            </header>

            <section className="feedback-list">
                <h3>Your History</h3>
                {myFeedbacks.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't submitted any feedback yet.</p>
                    </div>
                ) : (
                    <ul>
                        {myFeedbacks.map((fb) => (
                            <li key={fb._id} className="feedback-item" onClick={() => setSelectedFeedback(fb)}>
                                <div className="feedback-info">
                                    <span className="title">{fb.title}</span>
                                    <span className="category">{fb.category}</span>
                                </div>
                                <div className="feedback-meta">
                                    <span className={`priority ${fb.priority.toLowerCase()}`}>{fb.priority}</span>
                                    <span className={`status ${fb.status.toLowerCase().replace(' ', '-')}`}>{fb.status}</span>
                                    {(fb.status === 'Submitted' || fb.status === 'Open') && (
                                        <button
                                            className="edit-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFeedback(fb);
                                                setIsFormOpen(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {fb.status === 'Resolved' && (
                                        <button
                                            className="close-action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseFeedback(fb._id);
                                            }}
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {isFormOpen && (
                <FeedbackForm
                    onClose={() => {
                        setIsFormOpen(false);
                        setSelectedFeedback(null);
                    }}
                    initialData={selectedFeedback && selectedFeedback.status === 'Submitted' ? selectedFeedback : null}
                />
            )}
            {selectedFeedback && !isFormOpen && (
                <FeedbackDetail
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                />
            )}
        </div>
    );
};

export default UserDashboard;
