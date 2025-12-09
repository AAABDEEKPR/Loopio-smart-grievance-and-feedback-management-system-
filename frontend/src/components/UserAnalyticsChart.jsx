import React, { useState } from 'react';
import './UserAnalyticsChart.css';

const UserAnalyticsChart = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Dummy data for the chart
    const data = [
        { month: 'Jan', value: 30 },
        { month: 'Feb', value: 45 },
        { month: 'Mar', value: 35 },
        { month: 'Apr', value: 60 },
        { month: 'May', value: 50 },
        { month: 'Jun', value: 75 },
        { month: 'Jul', value: 65 },
        { month: 'Aug', value: 85 },
        { month: 'Sep', value: 80 },
        { month: 'Oct', value: 95 },
        { month: 'Nov', value: 90 },
        { month: 'Dec', value: 100 },
    ];

    const maxValue = Math.max(...data.map(d => d.value));

    // Calculate points for the SVG path
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxValue) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="user-analytics-chart">
            <div className="chart-header">
                <h3>Feedback Overview</h3>
                <p>
                    <span className="growth-indicator">
                        <span className="arrow">↑</span> 4% more
                    </span>{' '}
                    in 2024
                </p>
            </div>
            <div className="chart-body" onMouseLeave={() => setHoveredIndex(null)}>
                {/* Tooltip */}
                {hoveredIndex !== null && (
                    <div
                        className="chart-tooltip"
                        style={{
                            left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
                            top: `${100 - (data[hoveredIndex].value / maxValue) * 100}%`
                        }}
                    >
                        <span className="tooltip-value">{data[hoveredIndex].value}</span>
                        <span className="tooltip-month">{data[hoveredIndex].month}</span>
                    </div>
                )}

                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-svg">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0075FF" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0075FF" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <path
                        d={`M0,100 ${points} 100,100`}
                        fill="url(#chartGradient)"
                        className="chart-area"
                    />
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#0075FF"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        className="chart-line"
                    />

                    {/* Active Dot */}
                    {hoveredIndex !== null && (
                        <circle
                            cx={(hoveredIndex / (data.length - 1)) * 100}
                            cy={100 - (data[hoveredIndex].value / maxValue) * 100}
                            r="4"
                            fill="#fff"
                            stroke="#0075FF"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            className="active-dot"
                        />
                    )}

                    {/* Hover Triggers (Invisible Bars) */}
                    {data.map((_, i) => (
                        <rect
                            key={i}
                            x={(i / (data.length - 1)) * 100 - 4} // Center the trigger area
                            y="0"
                            width="8" // Width of trigger area in SVG units
                            height="100"
                            fill="transparent"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredIndex(i)}
                        />
                    ))}
                </svg>
            </div>
            <div className="chart-labels">
                {data.filter((_, i) => i % 2 === 0).map((d) => (
                    <span key={d.month}>{d.month}</span>
                ))}
            </div>
        </div>
    );
};

export default UserAnalyticsChart;
