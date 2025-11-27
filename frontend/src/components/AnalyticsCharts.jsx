import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import './AnalyticsCharts.css';

const AnalyticsCharts = () => {
    const { feedbacks } = useFeedback();

    // Calculate Status Distribution
    const statusCounts = feedbacks.reduce((acc, fb) => {
        acc[fb.status] = (acc[fb.status] || 0) + 1;
        return acc;
    }, {});

    const total = feedbacks.length;
    const statuses = ['Submitted', 'Pending', 'In Progress', 'Resolved', 'Closed'];

    // Calculate Category Distribution
    const categoryCounts = feedbacks.reduce((acc, fb) => {
        acc[fb.category] = (acc[fb.category] || 0) + 1;
        return acc;
    }, {});

    const categories = Object.keys(categoryCounts);
    const maxCount = Math.max(...Object.values(statusCounts), 1);

    return (
        <div className="analytics-charts">
            <div className="chart-container">
                <h3>Feedback Status Distribution</h3>
                <div className="bar-chart">
                    {statuses.map(status => {
                        const count = statusCounts[status] || 0;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        const height = total > 0 ? (count / maxCount) * 100 : 0;

                        return (
                            <div key={status} className="bar-group">
                                <div className="bar-wrapper">
                                    <div
                                        className={`bar ${status.toLowerCase().replace(' ', '-')}`}
                                        style={{ height: `${height}%` }}
                                        title={`${status}: ${count}`}
                                    >
                                        <span className="bar-value">{count}</span>
                                    </div>
                                </div>
                                <span className="bar-label">{status}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="chart-container">
                <h3>Category Breakdown</h3>
                <div className="category-list">
                    {categories.map(cat => (
                        <div key={cat} className="category-item">
                            <div className="category-info">
                                <span className="category-name">{cat}</span>
                                <span className="category-count">{categoryCounts[cat]}</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${(categoryCounts[cat] / total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
