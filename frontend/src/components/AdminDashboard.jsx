import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import AdminAnalyticsChart from './AdminAnalyticsChart';
import FeedbackDetail from './FeedbackDetail';
import {
    FaFileAlt, FaExclamationTriangle, FaRocket, FaCheckCircle, FaArrowUp, FaCheckCircle as FaCheckCircleFilled
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { feedbacks, users } = useFeedback();
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // Analytics
    const total = Array.isArray(feedbacks) ? feedbacks.length : 0;
    const pending = Array.isArray(feedbacks) ? feedbacks.filter(f => f.status === 'Pending' || f.status === 'Submitted').length : 0;
    const progress = Array.isArray(feedbacks) ? feedbacks.filter(f => f.status === 'In Progress' || f.status === 'Working').length : 0;
    const completed = Array.isArray(feedbacks) ? feedbacks.filter(f => f.status === 'Resolved' || f.status === 'Closed').length : 0;

    // Filter recent feedbacks for the dashboard view
    const recentFeedbacks = Array.isArray(feedbacks) ? feedbacks.slice(0, 5) : [];

    return (
        <>
            {/* Grid Layout Start */}
            {/* Row 1: Large Stats Cards */}
            <div className="stats-grid">
                <div className="vision-card stat-card">
                    <div className="stat-content">
                        <p className="stat-label">Total Feedback</p>
                        <h3 className="stat-value">{total}</h3>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#0075FF' }}><FaFileAlt /></div>
                </div>
                <div className="vision-card stat-card">
                    <div className="stat-content">
                        <p className="stat-label">Pending</p>
                        <h3 className="stat-value">{pending} <span className="stat-unit">Issues</span></h3>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#FFB547' }}><FaExclamationTriangle /></div>
                </div>
                <div className="vision-card stat-card">
                    <div className="stat-content">
                        <p className="stat-label">In Progress</p>
                        <h3 className="stat-value">{progress} <span className="stat-unit">Tasks</span></h3>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#21D4FD' }}><FaRocket /></div>
                </div>
                <div className="vision-card stat-card">
                    <div className="stat-content">
                        <p className="stat-label">Resolved</p>
                        <h3 className="stat-value">{completed} <span className="stat-unit">Fixed</span></h3>
                    </div>
                    <div className="stat-icon-box" style={{ background: '#01B574' }}><FaCheckCircle /></div>
                </div>
            </div>

            {/* Row 2: Welcome & Analytics */}
            <div className="dashboard-row-2">
                {/* Welcome Overview Card */}
                <div className="vision-card welcome-card">
                    <div className="welcome-content">
                        <p style={{ fontSize: '12px', color: '#A0AEC0', fontWeight: 'bold' }}>Welcome back,</p>
                        <h3>Admin Dashboard</h3>
                        <p>Overview of the system performance and feedback management. You have <strong>{pending} pending items</strong> requiring attention.</p>
                        <div className="welcome-action">
                            View All Items <FaArrowUp style={{ transform: 'rotate(45deg)' }} />
                        </div>
                    </div>
                    <div className="welcome-blob"></div>
                </div>

                {/* Analytics Section */}
                <div className="vision-card graph-card">
                    <div className="card-header">
                        <h3>Analytics Overview</h3>
                        <p>System-wide feedback trends</p>
                    </div>
                    <div className="chart-container" style={{ width: '100%', height: '300px' }}>
                        <AdminAnalyticsChart />
                    </div>
                </div>
            </div>

            {/* Row 3: Recent Feedback & Quick Info */}
            <div className="dashboard-row-3">
                {/* Main Table - Reduced to Recent Items */}
                <div className="vision-card">
                    <div className="card-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Recent Activity</h3>
                            <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#A0AEC0' }}>
                                <FaCheckCircleFilled className="inline-icon" style={{ color: '#01B574', marginRight: '5px' }} />
                                <strong>{recentFeedbacks.length} items</strong> shown
                            </p>
                        </div>
                    </div>

                    <div className="table-container" style={{ overflowX: 'auto' }}>
                        <table className="vision-table">
                            <thead>
                                <tr>
                                    <th>TITLE</th>
                                    <th>SUBMITTED BY</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFeedbacks.map((fb) => (
                                    <tr key={fb._id} onClick={() => setSelectedFeedback(fb)} className="clickable-row">
                                        <td className="company-cell">
                                            <div className="logo-box slack">{fb.submittedBy?.name?.charAt(0).toUpperCase() || 'U'}</div>
                                            <span style={{ fontWeight: '600' }}>{fb.title}</span>
                                        </td>
                                        <td>{fb.submittedBy?.name || 'Unknown'}</td>
                                        <td>
                                            <span className={`status ${(fb.status || '').toLowerCase().replace(' ', '-')}`} style={{
                                                padding: '4px 8px', borderRadius: '8px', fontSize: '10px',
                                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'
                                            }}>{fb.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Cards: Notifications & Quick Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="vision-card">
                        <h4 className="side-card-title">Notifications</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="quick-assign-item">
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#0075FF', borderRadius: '50%' }}></div>
                                    <div className="quick-assign-info">
                                        <p>New feedback submitted</p>
                                        <span>2 mins ago</span>
                                    </div>
                                </div>
                            </div>
                            <div className="quick-assign-item">
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#01B574', borderRadius: '50%' }}></div>
                                    <div className="quick-assign-info">
                                        <p>Project #424 completed</p>
                                        <span>1 hour ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="vision-card">
                        <h4 className="side-card-title">Quick Info</h4>
                        <div className="quick-assign-item">
                            <div className="quick-assign-info">
                                <p>Server Status</p>
                                <span style={{ color: '#01B574' }}>Operational</span>
                            </div>
                            <FaCheckCircleFilled style={{ color: '#01B574' }} />
                        </div>
                        <div className="quick-assign-item">
                            <div className="quick-assign-info">
                                <p>Database</p>
                                <span style={{ color: '#01B574' }}>Connected</span>
                            </div>
                            <FaCheckCircleFilled style={{ color: '#01B574' }} />
                        </div>
                    </div>
                </div>
            </div>

            {selectedFeedback && (
                <FeedbackDetail
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                />
            )}
        </>
    );
};

export default AdminDashboard;
