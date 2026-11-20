import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Navbar.module.css';

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Forget the user and the login token (AuthProvider also clears localStorage).
        // No server call needed: with JWT the server doesn't keep a list of logged-in users.
        logout();

        // Redirect to home or login page
        navigate('/');
    };

    return (
        <button 
        onClick={handleLogout}
        className={styles.button}>
        Logout
        </button>
    );
};

export default LogoutButton;