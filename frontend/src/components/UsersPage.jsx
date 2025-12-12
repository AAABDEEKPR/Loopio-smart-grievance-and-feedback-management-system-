import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { FaSearch, FaFileExport, FaCheckCircle, FaUser } from 'react-icons/fa';
import './AdminDashboard.css'; // Inherit global admin styles
import './UsersPage.css'; // Component specific responsive styles

const UsersPage = () => {
    const { users, feedbacks } = useFeedback();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper to calculate stats
    const getUserStats = (userId) => {
        const userFeedbacks = feedbacks.filter(fb => fb.submittedBy && fb.submittedBy._id === userId);
        const totalSubmitted = userFeedbacks.length;
        const resolvedCount = userFeedbacks.filter(fb => fb.status === 'Resolved' || fb.status === 'Closed').length;
        return { totalSubmitted, resolvedCount };
    };

    return (
        <div className="vision-card users-page-card" style={{ marginTop: '20px' }}>
            <div className="card-header-flex">
                <div className="users-header-info">
                    <h3>Users Management</h3>
                    <p>
                        <FaUser className="inline-icon" style={{ color: '#01B574', marginRight: '5px' }} />
                        <strong>{filteredUsers.length} users</strong> registered
                    </p>
                </div>
                <div className="users-header-actions">
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button className="btn-vision-primary">
                        <FaFileExport />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="table-container" style={{ overflowX: 'auto' }}>
                <table className="vision-table">
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>TOTAL FEEDBACKS SUBMITTED</th>
                            <th>TOTAL RESOLVED FEEDBACKS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => {
                            const { totalSubmitted, resolvedCount } = getUserStats(user._id);
                            return (
                                <tr key={user._id} className="hover-row">
                                    <td className="company-cell">
                                        <div className="logo-box atlassian">{user.name.charAt(0).toUpperCase()}</div>
                                        <span style={{ fontWeight: '600' }}>{user.name}</span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td style={{ textAlign: 'center' }}>{totalSubmitted}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        {resolvedCount}
                                        {resolvedCount > 0 && <span className="status-dot green" style={{ display: 'inline-block', width: '6px', height: '6px', background: '#01B574', borderRadius: '50%', marginLeft: '8px', verticalAlign: 'middle' }}></span>}
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: '#A0AEC0', padding: '20px' }}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;
