import React, { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();
const API_URL = 'http://localhost:5000/api/feedbacks';
const AUTH_URL = 'http://localhost:5000/api/auth';

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]); // This will store developers for assignment
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFeedbacks(data);
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            Promise.all([fetchFeedbacks(), fetchDevelopers()]).then(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Actions
    const addFeedback = async (feedback) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(feedback)
            });
            if (res.ok) {
                const newFeedback = await res.json();
                setFeedbacks([newFeedback, ...feedbacks]);
                return { success: true };
            }
        } catch (error) {
            console.error('Error adding feedback:', error);
        }
        return { success: false };
    };

    const updateFeedbackStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const updatedFeedback = await res.json();
                setFeedbacks(prev => prev.map(fb => fb._id === id ? updatedFeedback : fb));
            }
        } catch (error) {
            console.error('Error updating status:', error);
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
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Error deleting feedback');
        }
    };

    const updateUserRole = (userId, newRole) => {
        // Not implemented in backend yet
        console.log('Update role not implemented');
    };

    return (
        <FeedbackContext.Provider value={{
            feedbacks, users, searchQuery, setSearchQuery,
            addFeedback, updateFeedbackStatus, assignDeveloper, editFeedback,
            addComment, deleteFeedback, updateUserRole,
            refreshFeedbacks: fetchFeedbacks
        }}>
            {children}
        </FeedbackContext.Provider>
    );
};
