import React, { useEffect, useState, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import './NotificationBell.css';

// Mock function to fetch notification count (could be replaced with real API)
const fetchNotifications = () => {
    // For demo, return a list of mock notifications
    const mocks = [
        "New feedback assigned to you",
        "Status updated on 'Login Bug'",
        "New comment on 'Dark Mode'",
        "System maintenance scheduled"
    ];
    // Randomly pick some
    return mocks.slice(0, Math.floor(Math.random() * 5));
};

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const updateNotifications = () => setNotifications(fetchNotifications());
        updateNotifications();
        const interval = setInterval(updateNotifications, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="notification-bell" onClick={toggleDropdown} ref={dropdownRef}>
            <FaBell size={20} />
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">Notifications</div>
                    {notifications.length > 0 ? (
                        <ul className="notification-list">
                            {notifications.map((note, index) => (
                                <li key={index} className="notification-item">{note}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className="notification-empty">No new notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
