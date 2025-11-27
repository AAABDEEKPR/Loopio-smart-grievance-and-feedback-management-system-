import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import FeedbackDetail from './FeedbackDetail';
import AnalyticsCharts from './AnalyticsCharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { feedbacks, users, assignDeveloper, updateUserRole, searchQuery } = useFeedback();
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [activeTab, setActiveTab] = useState('feedbacks'); // 'feedbacks' or 'users'
    const [pendingAssignments, setPendingAssignments] = useState({});

    const handleAssignmentChange = (feedbackId, developerId) => {
        setPendingAssignments(prev => ({
            ...prev,
            [feedbackId]: developerId
        }));
    };

    const handleUpdateClick = (feedbackId) => {
        const developerId = pendingAssignments[feedbackId];
        if (developerId) {
            // UI-only for now: just log or alert
            console.log(`Updating feedback ${feedbackId} to developer ${developerId}`);
            alert(`Assigned to developer (UI only)`);

            // Ideally we would call assignDeveloper(feedbackId, developerId) here later
            // assignDeveloper(feedbackId, developerId);
        }
    };

    // Temporary: Allow assigning any user (as requested)
    const developers = users; // users.filter(u => u.role === 'developer');

    const filteredFeedbacks = feedbacks.filter(fb =>
        fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.submittedBy && fb.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Analytics
    const total = feedbacks.length;
    const pending = feedbacks.filter(f => f.status === 'Pending' || f.status === 'Submitted').length;
    const progress = feedbacks.filter(f => f.status === 'In Progress' || f.status === 'Working').length;
    const completed = feedbacks.filter(f => f.status === 'Resolved' || f.status === 'Closed').length;

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p className="subtitle">Manage system overview and users</p>
                </div>
            </div>

            <div className="analytics">
                <div className="stat-card total">
                    <h3>Total Feedback</h3>
                    <div className="count">{total}</div>
                </div>
                <div className="stat-card pending">
                    <h3>Pending</h3>
                    <div className="count">{pending}</div>
                </div>
                <div className="stat-card progress">
                    <h3>In Progress</h3>
                    <div className="count">{progress}</div>
                </div>
                <div className="stat-card completed">
                    <h3>Completed</h3>
                    <div className="count">{completed}</div>
                </div>
            </div>

            <AnalyticsCharts />

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feedbacks')}
                >
                    Feedbacks
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    User Management
                </button>
            </div>

            {activeTab === 'feedbacks' ? (
                <section className="feedback-list">
                    <h3>All Feedbacks</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Submitted By</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbacks.map((fb) => (
                                <tr key={fb._id} onClick={() => setSelectedFeedback(fb)} className="clickable-row">
                                    <td>{fb.title}</td>
                                    <td>{fb.submittedBy?.name || 'Unknown'}</td>
                                    <td><span className={`status ${fb.status.toLowerCase().replace(' ', '-')}`}>{fb.status}</span></td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <select
                                            value={pendingAssignments[fb._id] || fb.assignedTo?._id || ''}
                                            onChange={(e) => handleAssignmentChange(fb._id, e.target.value)}
                                            className="assign-select"
                                            disabled={fb.status === 'Closed'}
                                        >
                                            <option value="">-- Unassigned --</option>
                                            {developers.map((dev) => (
                                                <option key={dev._id} value={dev._id}>
                                                    {dev.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <button
                                            className="action-btn update-btn"
                                            onClick={() => handleUpdateClick(fb._id)}
                                            disabled={!pendingAssignments[fb._id] || pendingAssignments[fb._id] === fb.assignedTo?._id}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ) : (
                <section className="feedback-list">
                    <h3>User Management</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            value={u.role}
                                            onChange={(e) => updateUserRole(u._id, e.target.value)}
                                            className="role-select"
                                        >
                                            <option value="user">User</option>
                                            <option value="developer">Developer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {selectedFeedback && (
                <FeedbackDetail
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
