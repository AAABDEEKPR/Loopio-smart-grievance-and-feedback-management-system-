import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useTheme } from '../context/ThemeContext';
import { useFeedback } from '../context/FeedbackContext';
import NotificationBell from './NotificationBell';
import { IoSearchOutline } from "react-icons/io5";
import './Navbar.css';

const Navbar = ({ onProfileClick }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { setSearchQuery } = useFeedback();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>Loopio</h1>
            </div>

            <div className="navbar-search">
                <input
                    type="text"
                    placeholder="Search feedback..."
                    onChange={handleSearch}
                />
                <IoSearchOutline className="search-icon" />
            </div>

            <div className="navbar-actions">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <NotificationBell />

                <div className="profile-menu">
                    <div
                        className={`profile-trigger ${isProfileOpen ? 'active' : ''}`}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="avatar">{user?.name.charAt(0)}</div>
                        <span className="username">{user?.name}</span>
                        <span className="dropdown-arrow">▼</span>
                    </div>

                    {isProfileOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <div className="header-avatar">{user?.name.charAt(0)}</div>
                                <div className="header-info">
                                    <strong>{user?.name}</strong>
                                    <small>{user?.role}</small>
                                </div>
                            </div>
                            <div className="dropdown-body">
                                <button onClick={() => {
                                    setIsProfileOpen(false);
                                    onProfileClick();
                                }}>
                                    👤 My Profile
                                </button>
                                <button onClick={() => setIsProfileOpen(false)}>
                                    ⚙️ Settings
                                </button>
                            </div>
                            <div className="dropdown-footer">
                                <button onClick={logout} className="logout-btn">
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
