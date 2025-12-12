import React, { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();
const API_URL = 'http://localhost:5000/api/feedbacks';
const AUTH_URL = 'http://localhost:5000/api/auth';

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]); // This will store developers for assignment
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [analytics, setAnalytics] = useState({ total: 0, status: {}, priority: {}, category: {} });
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`http://localhost:5000/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markNotificationAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Update UI optimistically
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${API_URL}/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Build query string
            let queryUrl = `${API_URL}?page=${pagination.page}`;
            if (searchQuery) {
                queryUrl += `&search=${encodeURIComponent(searchQuery)}`;
            }
            if (filters.status) queryUrl += `&status=${encodeURIComponent(filters.status)}`;
            if (filters.priority) queryUrl += `&priority=${encodeURIComponent(filters.priority)}`;
            if (filters.category) queryUrl += `&category=${encodeURIComponent(filters.category)}`;

            const res = await fetch(queryUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.feedbacks) {
                    setFeedbacks(data.feedbacks);
                    setPagination({
                        page: data.page,
                        pages: data.pages,
                        total: data.total
                    });
                } else {
                    setFeedbacks(data); // Fallback if API reverts
                }
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    const fetchDevelopers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${AUTH_URL}/developers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching developers:', error);
        }
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Debounce could be added here, but for now direct dependency
            const timer = setTimeout(() => {
                Promise.all([fetchFeedbacks(), fetchDevelopers(), fetchAnalytics(), fetchNotifications()]).then(() => setLoading(false));
            }, 500); // 500ms debounce
            return () => clearTimeout(timer);
        } else {
            setLoading(false);
        }
    }, [searchQuery, filters]);

    // Actions
    const addFeedback = async (feedbackData) => {
        const token = localStorage.getItem('token');
        try {
            let body;
            let headers = {
                Authorization: `Bearer ${token}`
            };

            // Check if there is a file or if we should use FormData
            if (feedbackData.file || feedbackData instanceof FormData) {
                const formData = new FormData();
                formData.append('title', feedbackData.title);
                formData.append('description', feedbackData.description);
                formData.append('category', feedbackData.category);
                formData.append('priority', feedbackData.priority);
                if (feedbackData.file) {
                    formData.append('file', feedbackData.file);
                }
                body = formData;
                // Do NOT set Content-Type for FormData, browser does it
            } else {
                body = JSON.stringify(feedbackData);
                headers['Content-Type'] = 'application/json';
            }

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: headers,
                body: body
            });

            if (res.ok) {
                const newFeedback = await res.json();
                setFeedbacks([newFeedback, ...feedbacks]);
                fetchAnalytics(); // Refresh analytics
                fetchNotifications(); // Refresh notifications incase of auto-notify
                return { success: true };
            }
        } catch (error) {
            console.error('Error adding feedback:', error);
        }
        return { success: false };
    };

    const updateFeedbackStatus = async (id, status, additionalData = {}) => {
        try {
            const res = await fetch(`http://localhost:5000/api/feedbacks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status, ...additionalData })
            });
            const data = await res.json();
            setFeedbacks(feedbacks.map(fb => fb._id === id ? data : fb));
            fetchAnalytics(); // Refresh analytics
        } catch (error) {
            console.error('Error updating feedback:', error);
        }
    };

    const assignDeveloper = async (feedbackId, developerId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/${feedbackId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignedTo: developerId })
            });
            if (res.ok) {
                const updatedFeedback = await res.json();
                setFeedbacks(prev => prev.map(fb => fb._id === feedbackId ? updatedFeedback : fb));
            }
        } catch (error) {
            console.error('Error assigning developer:', error);
        }
    };

    const addComment = async (feedbackId, comment) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/${feedbackId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: comment.text })
            });
            if (res.ok) {
                const updatedFeedback = await res.json();
                setFeedbacks(prev => prev.map(fb => fb._id === feedbackId ? updatedFeedback : fb));
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const editFeedback = async (id, updatedData) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const updatedFeedback = await res.json();
                setFeedbacks(prev => prev.map(fb => fb._id === id ? updatedFeedback : fb));
                fetchAnalytics(); // Refresh analytics
                return { success: true };
            }
        } catch (error) {
            console.error('Error editing feedback:', error);
        }
        return { success: false };
    };

    const deleteFeedback = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                setFeedbacks(prev => prev.filter(fb => fb._id !== id));
                fetchAnalytics(); // Refresh analytics
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Error deleting feedback');
        }
    };

    const deleteComment = async (feedbackId, commentId) => {
        const token = localStorage.getItem('token');
        console.log('Attempting to delete comment:', { feedbackId, commentId });
        try {
            const res = await fetch(`${API_URL}/${feedbackId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Delete response status:', res.status);

            if (res.ok) {
                const updatedFeedback = await res.json();
                console.log('Delete successful, updated feedback:', updatedFeedback);
                setFeedbacks(prev => prev.map(fb => fb._id === feedbackId ? updatedFeedback : fb));
                return { success: true };
            } else {
                const errData = await res.json();
                console.error('Delete failed:', errData);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
        return { success: false };
    };

    const updateUserRole = (userId, newRole) => {
        // Not implemented in backend yet
        console.log('Update role not implemented');
    };

    return (
        <FeedbackContext.Provider value={{
            feedbacks, users, searchQuery, setSearchQuery, pagination, analytics, notifications, filters, updateFilter,
            addFeedback, updateFeedbackStatus, assignDeveloper, editFeedback,
            addComment, deleteFeedback, deleteComment, updateUserRole,
            refreshFeedbacks: fetchFeedbacks, reloadAnalytics: fetchAnalytics,
            markNotificationAsRead, refreshNotifications: fetchNotifications
        }}>
            {children}
        </FeedbackContext.Provider>
    );
};
