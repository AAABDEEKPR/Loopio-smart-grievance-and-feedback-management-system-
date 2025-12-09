import React, { useState } from 'react';
import './UserAnalyticsChart.css'; // Reusing the same CSS for consistency

const DeveloperProductivityChart = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Dummy data for developer productivity (Tasks Completed)
    const data = [
        { month: 'Jan', value: 12 },
        { month: 'Feb', value: 19 },
        { month: 'Mar', value: 15 },
        { month: 'Apr', value: 25 },
        { month: 'May', value: 22 },
        { month: 'Jun', value: 30 },
        { month: 'Jul', value: 28 },
        { month: 'Aug', value: 35 },
        { month: 'Sep', value: 40 },
        { month: 'Oct', value: 45 },
        { month: 'Nov', value: 42 },
        { month: 'Dec', value: 50 },
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
                <h3>Productivity</h3>
                <p>
                    <span className="growth-indicator">
                        <span className="arrow">↑</span> 15% more
                    </span>{' '}
                    tasks this month
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
                        <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#01B574" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#01B574" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <path
                        d={`M0,100 ${points} 100,100`}
                        fill="url(#prodGradient)"
                        className="chart-area"
                    />
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#01B574"
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
                            stroke="#01B574"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            className="active-dot"
                        />
                    )}

                    {/* Hover Triggers */}
                    {data.map((_, i) => (
                        <rect
                            key={i}
                            x={(i / (data.length - 1)) * 100 - 4}
                            y="0"
                            width="8"
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

export default DeveloperProductivityChart;
