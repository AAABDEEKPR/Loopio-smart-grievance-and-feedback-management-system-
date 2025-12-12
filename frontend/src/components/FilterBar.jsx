import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import './FilterBar.css';

const FilterBar = () => {
    const { filters, updateFilter } = useFeedback();

    return (
        <div className="filter-bar-container">
            <select
                className="filter-select"
                value={filters.priority}
                onChange={(e) => updateFilter('priority', e.target.value)}
            >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>

            <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
            >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
            </select>

            <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
            >
                <option value="">All Categories</option>
                <option value="Software Issue">Software Issue</option>
                <option value="HR Issue">HR Issue</option>
                <option value="Project Issue">Project Issue</option>
                <option value="Workplace Issue">Workplace Issue</option>
                <option value="Other">Other</option>
            </select>

            {(filters.priority || filters.status || filters.category) && (
                <button
                    onClick={() => {
                        updateFilter('priority', '');
                        updateFilter('status', '');
                        updateFilter('category', '');
                    }}
                    className="btn-clear-filters"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default FilterBar;
