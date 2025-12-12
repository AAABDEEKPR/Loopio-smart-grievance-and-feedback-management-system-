import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import './UserProfile.css';

const UserProfile = ({ onClose }) => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const res = await updateProfile(formData);
        if (res.success) {
            setMessage('Profile updated successfully!');
            setTimeout(() => {
                setIsEditing(false);
                setMessage('');
            }, 1500);
        } else {
            setMessage(res.message || 'Update failed');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit Profile' : 'My Profile'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="profile-body">
                    <div className="profile-avatar-large">
                        {user.name.charAt(0)}
                    </div>

                    {message && <p className="status-message">{message}</p>}

                    <div className="profile-details">
                        {isEditing ? (
                            <>
                                <div className="detail-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="edit-input"
                                    />
                                </div>
                                <div className="detail-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="edit-input"
                                    />
                                </div>
                                <div className="detail-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="edit-input"
                                        placeholder="+88017..."
                                    />
                                </div>
                                <div className="detail-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="edit-input"
                                        placeholder="Dhaka, Bangladesh"
                                    />
                                </div>
                                <div className="detail-group">
                                    <label>New Password (leave blank to keep current)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="edit-input"
                                        placeholder="********"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="detail-group">
                                    <label>Full Name</label>
                                    <p>{user.name}</p>
                                </div>
                                <div className="detail-group">
                                    <label>Email Address</label>
                                    <p>{user.email}</p>
                                </div>
                                {user.phone && (
                                    <div className="detail-group">
                                        <label>Phone Number</label>
                                        <p>{user.phone}</p>
                                    </div>
                                )}
                                {user.address && (
                                    <div className="detail-group">
                                        <label>Address</label>
                                        <p>{user.address}</p>
                                    </div>
                                )}
                                <div className="detail-group">
                                    <label>Role</label>
                                    <span className="role-badge">{user.role}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    {isEditing ? (
                        <>
                            <button className="secondary-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="primary-btn" onClick={handleSubmit}>Save Changes</button>
                        </>
                    ) : (
                        <>
                            <button className="secondary-btn" onClick={onClose}>Close</button>
                            <button className="primary-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
