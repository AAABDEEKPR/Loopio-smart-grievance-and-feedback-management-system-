import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from './AuthProvider';
import { useTheme } from '../context/ThemeContext';
import FeedbackForm from './FeedbackForm';
import FeedbackDetail from './FeedbackDetail';
import NotificationBell from './NotificationBell';
import {
    FaHome, FaUser, FaSignOutAlt, FaRocket, FaCheckCircle, FaClock, FaBars, FaTimes, FaList, FaSun, FaMoon, FaCalendarAlt
} from 'react-icons/fa';
import './MyFeedbacksPage.css'; // Responsive table styles
import loopioLogo from '../assets/Loopio_logo_.png';

const MyFeedbacksPage = ({ onProfileClick }) => {
    const { feedbacks, searchQuery, setSearchQuery } = useFeedback();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const myFeedbacks = feedbacks.filter(fb =>
        fb.submittedBy && fb.submittedBy._id === user._id &&
        (fb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fb.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="vision-dashboard">
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

            <aside className={`vision-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header-mobile">
                    <div className="logo-icon">
                        <img src={loopioLogo} alt="Loopio Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span className="logo-text">Loopio</span>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </div>

                <nav className="sidebar-nav" style={{ marginTop: '20px' }}>
                    <a href="/user" className="nav-item">
                        <div className="icon-box"><FaHome /></div>
                        <span>Dashboard</span>
                    </a>
                    <a href="/user/my-feedbacks" className="nav-item active">
                        <div className="icon-box"><FaList /></div>
                        <span>My Feedbacks</span>
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
                <header className="vision-header">
                    <div className="header-left">
                        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                            <FaBars />
                        </button>
                        <div className="logo-icon">
                            <img src={loopioLogo} alt="Loopio Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        </div>
                        <span className="logo-text">Loopio</span>
                    </div>

                    <div className="header-actions">
                        <div className="search-bar">
                            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </button>
                        <NotificationBell />
                        <div className="profile-section">
                            <div className="profile-bubble" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            {showProfileMenu && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); onProfileClick(); }}>
                                        <FaUser /> Profile
                                    </div>
                                    <div className="dropdown-item danger" onClick={() => { setShowProfileMenu(false); window.location.href = '/'; }}>
                                        <FaSignOutAlt /> Log Out
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="vision-card my-feedbacks-card">
                        <div className="card-header-flex">
                            <h3>My Feedbacks</h3>
                            <p className="card-subtitle">Track your submitted issues</p>
                        </div>

                        <div className="table-container" style={{ marginTop: '20px' }}>
                            <table className="vision-table">
                                <thead>
                                    <tr>
                                        <th>TITLE</th>
                                        <th>CATEGORY</th>
                                        <th>PRIORITY</th>
                                        <th>STATUS</th>
                                        <th>ESTIMATED RESOLUTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myFeedbacks.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#A0AEC0' }}>
                                                No feedbacks found.
                                            </td>
                                        </tr>
                                    ) : (
                                        myFeedbacks.map(fb => (
                                            <tr key={fb._id} className="clickable-row" onClick={() => setSelectedFeedback(fb)}>
                                                <td style={{ fontWeight: '600' }}>{fb.title}</td>
                                                <td>{fb.category}</td>
                                                <td>
                                                    <span className={`priority-badge ${fb.priority.toLowerCase()}`}>{fb.priority}</span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${fb.status.toLowerCase().replace(' ', '-')}`}>{fb.status}</span>
                                                </td>
                                                <td style={{ color: fb.estimatedResolutionDate ? '#00D9F4' : 'inherit' }}>
                                                    {fb.estimatedResolutionDate ? new Date(fb.estimatedResolutionDate).toLocaleDateString() : 'TBD'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
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

export default MyFeedbacksPage;
