import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user from context (and localStorage via AuthProvider)
        setUser(null);
        // Optionally, call backend logout endpoint to clear server-side session/cookie:
        // fetch('/api/logout', { method: 'POST', credentials: 'include' });

        // Redirect to home or login page
        navigate('/');
    };

    return (
        <button onClick={handleLogout}>
        Logout
        </button>
    );
};

export default LogoutButton;