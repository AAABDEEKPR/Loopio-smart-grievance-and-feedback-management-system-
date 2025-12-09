import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from './AuthProvider';
import { useTheme } from '../context/ThemeContext';
import FeedbackDetail from './FeedbackDetail';
import NotificationBell from './NotificationBell';
import DeveloperProductivityChart from './DeveloperProductivityChart';
import {
    FaHome, FaList, FaUser, FaSignOutAlt, FaCheckCircle, FaExclamationTriangle,
    FaRocket, FaClock, FaBars, FaTimes, FaChartLine, FaBolt, FaHistory, FaThumbsUp,
    FaSun, FaMoon
} from 'react-icons/fa';
import './DeveloperDashboard.css';
import loopioLogo from '../assets/Loopio_logo_.png';

const DeveloperDashboard = ({ onProfileClick }) => {
    const { feedbacks, updateFeedbackStatus, assignDeveloper, searchQuery, setSearchQuery } = useFeedback();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Filter feedbacks assigned to this developer
    const myTasks = feedbacks.filter(fb =>
        fb.assignedTo && fb.assignedTo._id === user._id &&
        (fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fb.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pendingTasks = myTasks.filter(t => t.status === 'Pending');
    const activeTasks = myTasks.filter(t => ['In Progress', 'Working'].includes(t.status));
    const completedTasks = myTasks.filter(t => ['Resolved', 'Closed'].includes(t.status));

    // Derived metrics for UI
    const completionRate = myTasks.length > 0 ? Math.round((completedTasks.length / myTasks.length) * 100) : 0;
    const satisfactionRate = 98; // Hardcoded placeholder for now as per requirements

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
        <div className="vision-dashboard">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99, backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            {/* Sidebar */}
            <aside className={`vision-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header-mobile">
                    <div className="logo-icon">
                        <img src={loopioLogo} alt="Loopio Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span className="logo-text">Loopio <span className="dashboard-section-label">Dev Section</span></span>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </div>

                <nav className="sidebar-nav" style={{ marginTop: '20px' }}>
                    <a href="#" className="nav-item active">
                        <div className="icon-box"><FaHome /></div>
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className="nav-item">
                        <div className="icon-box"><FaList /></div>
                        <span>Assigned Tasks</span>
                    </a>
                    <a href="#" className="nav-item">
                        <div className="icon-box"><FaExclamationTriangle /></div>
                        <span>Feedback to Fix</span>
                    </a>
                    <a href="#" className="nav-item">
                        <div className="icon-box"><FaChartLine /></div>
                        <span>Progress</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onProfileClick(); }}>
                        <div className="icon-box"><FaUser /></div>
                        <span>Profile</span>
                    </a>
                </nav>

                <div className="sidebar-footer-card">
                    <div className="logo-icon" style={{ width: '32px', height: '32px', marginBottom: '5px', background: 'transparent' }}>
                        <img src={loopioLogo} alt="Loopio Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <p>© 2025 LOOPIO</p>
                    <button className="btn-text" onClick={() => window.location.href = '/'} style={{ fontSize: '12px', color: '#E31A1A', marginTop: '5px' }}>
                        Log Out
                    </button>
                </div>
            </aside>

            <main className="vision-main">
                {/* Header */}
                <header className="vision-header">
                    <div className="header-left">
                        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                            <FaBars />
                        </button>
                        <div className="logo-icon">
                            <img src={loopioLogo} alt="Loopio Logo" />
                        </div>
                        <span className="logo-text">Loopio <span className="dashboard-section-label">Dev Section</span></span>
                    </div>

                    <div className="header-actions">
                        <div className="search-bar">
                            <input type="text" placeholder="Type here..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </button>
                        <NotificationBell />

                        <div className="profile-section">
                            <div className="profile-bubble" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'D'}
                            </div>
                            {isProfileMenuOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-item" onClick={() => { setIsProfileMenuOpen(false); onProfileClick(); }}>
                                        <FaUser /> Profile
                                    </div>
                                    <div className="dropdown-item danger" onClick={() => { setIsProfileMenuOpen(false); window.location.href = '/'; }}>
                                        <FaSignOutAlt /> Log Out
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Stats Grid */}
                    <section className="dashboard-section section-stats">
                        <div className="vision-card stat-card">
                            <div className="stat-content">
                                <p className="stat-label">Assigned Feedback</p>
                                <h3 className="stat-value">{myTasks.length}</h3>
                                <span className="stat-change positive">+3 this week</span>
                            </div>
                            <div className="vision-icon"><FaList /></div>
                        </div>
                        <div className="vision-card stat-card">
                            <div className="stat-content">
                                <p className="stat-label">Pending</p>
                                <h3 className="stat-value">{pendingTasks.length}</h3>
                                <span className="stat-change negative">{pendingTasks.length > 0 ? 'Needs Attention' : 'On Track'}</span>
                            </div>
                            <div className="vision-icon icon-warn"><FaClock /></div>
                        </div>
                        <div className="vision-card stat-card">
                            <div className="stat-content">
                                <p className="stat-label">In Progress</p>
                                <h3 className="stat-value">{activeTasks.length}</h3>
                                <span className="stat-change positive">Working</span>
                            </div>
                            <div className="vision-icon icon-info"><FaRocket /></div>
                        </div>
                        <div className="vision-card stat-card">
                            <div className="stat-content">
                                <p className="stat-label">Completed</p>
                                <h3 className="stat-value">{completedTasks.length}</h3>
                                <span className="stat-change positive">+2 today</span>
                            </div>
                            <div className="vision-icon icon-success"><FaCheckCircle /></div>
                        </div>
                    </section>

                    {/* Charts Grid */}
                    <section className="dashboard-section section-charts">
                        {/* Circular Progress: Satisfaction Rate */}
                        <div className="vision-card satisfaction-card">
                            <h3>Satisfaction Rate</h3>
                            <p className="sub-text">From all feedback</p>
                            <div className="circular-progress-container">
                                <div className="circular-progress">
                                    <div className="inner-circle">
                                        <span>{satisfactionRate}%</span>
                                        <small>Based on likes</small>
                                    </div>
                                </div>
                            </div>
                            <div className="satisfaction-footer">
                                <div className="pill">0% Bad</div>
                                <div className="pill">100% Good</div>
                            </div>
                        </div>

                        {/* Productivity Chart */}
                        <div className="vision-card productivity-card">
                            <DeveloperProductivityChart />
                        </div>

                        {/* Activity Summary */}
                        <div className="vision-card activity-card">
                            <h3>Activity Summary</h3>
                            <div className="activity-list">
                                {completedTasks.slice(0, 3).map((task, i) => (
                                    <div key={i} className="activity-item">
                                        <div className="activity-icon-small icon-success">
                                            <FaCheckCircle />
                                        </div>
                                        <div className="activity-text">
                                            <p className="activity-title">Fixed {task.title}</p>
                                            <p className="activity-time">Just now</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="activity-item">
                                    <div className="activity-icon-small icon-info">
                                        <FaRocket />
                                    </div>
                                    <div className="activity-text">
                                        <p className="activity-title">New assignment</p>
                                        <p className="activity-time">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon-small icon-warn">
                                        <FaClock />
                                    </div>
                                    <div className="activity-text">
                                        <p className="activity-title">Meeting with team</p>
                                        <p className="activity-time">Yesterday</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Table Section */}
                    <section className="dashboard-section section-table">
                        <div className="vision-card table-card">
                            <div className="card-header-flex">
                                <div>
                                    <h3>Assigned Feedback</h3>
                                    <p className="card-subtitle">
                                        <FaCheckCircle className="inline-icon success-text" />
                                        <strong> {myTasks.length} tasks</strong> in your list
                                    </p>
                                </div>
                            </div>

                            {myTasks.length === 0 ? (
                                <div className="empty-state">
                                    <p>No tasks assigned yet.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="vision-table">
                                        <thead>
                                            <tr>
                                                <th>TITLE</th>
                                                <th>PRIORITY</th>
                                                <th>STATUS</th>
                                                <th>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myTasks.map((fb) => (
                                                <tr key={fb._id} onClick={() => setSelectedFeedback(fb)} className="clickable-row">
                                                    <td className="company-cell">
                                                        <div className="logo-box slack">T</div>
                                                        <span className="title-text">{fb.title}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`priority-badge ${fb.priority.toLowerCase()}`}>
                                                            {fb.priority}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${fb.status.toLowerCase().replace(' ', '-')}`}>{fb.status}</span>
                                                    </td>
                                                    <td onClick={e => e.stopPropagation()}>
                                                        {fb.status === 'Pending' ? (
                                                            <div className="action-buttons">
                                                                <button className="btn-text success-text" onClick={() => handleAccept(fb._id)}>ACCEPT</button>
                                                                <button className="btn-text danger-text" onClick={() => handleReject(fb._id)}>REJECT</button>
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
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="dashboard-section section-actions">
                        <div className="quick-actions-card">
                            <div className="quick-actions-header">
                                <h4>Quick Actions</h4>
                                <p>Update your status and manage tasks efficiently</p>
                            </div>
                            <div className="quick-actions-buttons">
                                <button className="quick-action-btn primary">
                                    <FaBolt className="btn-icon" /> Sync Tasks
                                </button>
                                <button className="quick-action-btn secondary">
                                    <FaThumbsUp className="btn-icon" /> Clear Completed
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {selectedFeedback && (
                    <FeedbackDetail
                        feedback={selectedFeedback}
                        onClose={() => setSelectedFeedback(null)}
                    />
                )}
            </main>
        </div>
    );
};

export default DeveloperDashboard;
