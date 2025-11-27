import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from './AuthProvider';
import FeedbackDetail from './FeedbackDetail';
import NotificationBell from './NotificationBell';
import './DeveloperDashboard.css';

const DeveloperDashboard = () => {
    const { feedbacks, updateFeedbackStatus, assignDeveloper, searchQuery } = useFeedback();
    const { user } = useAuth();
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // Filter feedbacks assigned to this developer
    const myTasks = feedbacks.filter(fb =>
        fb.assignedTo && fb.assignedTo._id === user._id &&
        (fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fb.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pendingTasks = myTasks.filter(t => t.status === 'Pending');
    const activeTasks = myTasks.filter(t => ['In Progress', 'Working'].includes(t.status));
    const completedTasks = myTasks.filter(t => ['Resolved', 'Closed'].includes(t.status));

    const handleAccept = (id) => {
        updateFeedbackStatus(id, 'In Progress');
    };

    const handleReject = (id) => {
        if (window.confirm('Reject this assignment?')) {
            assignDeveloper(id, null); // Unassign
            updateFeedbackStatus(id, 'Open');
        }
    };

    const handleStatusChange = (id, newStatus) => {
        updateFeedbackStatus(id, newStatus);
    };

    return (
        <div className="developer-dashboard">
            <header className="dashboard-header">
                <div>
                    <h2>Developer Console</h2>
                    <p className="subtitle">Manage your assigned tasks</p>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Pending</h3>
                    <span className="count">{pendingTasks.length}</span>
                </div>
                <div className="stat-card">
                    <h3>Active</h3>
                    <span className="count">{activeTasks.length}</span>
                </div>
                <div className="stat-card">
                    <h3>Completed</h3>
                    <span className="count">{completedTasks.length}</span>
                </div>
            </div>

            <section className="feedback-list">
                <h3>My Tasks</h3>
                {myTasks.length === 0 ? (
                    <p className="empty-state">No tasks assigned yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myTasks.map((fb) => (
                                <tr key={fb._id} onClick={() => setSelectedFeedback(fb)} className="clickable-row">
                                    <td>{fb.title}</td>
                                    <td><span className={`priority ${fb.priority.toLowerCase()}`}>{fb.priority}</span></td>
                                    <td><span className={`status ${fb.status.toLowerCase().replace(' ', '-')}`}>{fb.status}</span></td>
                                    <td onClick={e => e.stopPropagation()}>
                                        {fb.status === 'Pending' ? (
                                            <div className="action-buttons">
                                                <button className="accept-btn" onClick={() => handleAccept(fb._id)}>Accept</button>
                                                <button className="reject-btn" onClick={() => handleReject(fb._id)}>Reject</button>
                                            </div>
                                        ) : (
                                            <select
                                                value={fb.status}
                                                onChange={(e) => handleStatusChange(fb._id, e.target.value)}
                                                className="status-select"
                                                disabled={fb.status === 'Closed'}
                                            >
                                                <option value="In Progress">In Progress</option>
                                                <option value="Working">Working</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {selectedFeedback && (
                <FeedbackDetail
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                />
            )}
        </div>
    );
};

export default DeveloperDashboard;
