import React from 'react';
import { FaHammer } from 'react-icons/fa';

const AllFeedbacksPage = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: '#fff',
            textAlign: 'center'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '20px',
                color: '#0075FF',
                background: 'rgba(0, 117, 255, 0.1)',
                padding: '20px',
                borderRadius: '50%'
            }}>
                <FaHammer />
            </div>
            <h2>Page Under Construction</h2>
            <p style={{ color: '#A0AEC0', maxWidth: '400px' }}>
                This page is currently being built. Check back soon for the full feedback management interface!
            </p>
        </div>
    );
};

export default AllFeedbacksPage;
