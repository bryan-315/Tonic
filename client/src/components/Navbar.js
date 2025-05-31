// React/Hook Imports
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { NavLink } from 'react-router-dom';

// CSS Import
import styles from '../styles/Navbar.module.css';

// Component Imports
import LogoutButton from './LogoutButton';


const Navbar = () => {
    // States
    const [query, setQuery] = useState("");
    const { user, setUser } = useAuth();

    const navigate = useNavigate();

    // Functions
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value === "") {
            navigate("/");
        }
    }

    const handleSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) {
            navigate("/");
        } else {
            navigate(`/all-drinks?q=${encodeURIComponent(query.trim())}`);
        }
    }

    return (
        <nav className={styles.navbar}>
            <NavLink to="/" className={styles.logo}>
                <h1>tonic</h1>
            </NavLink>
            <div className={styles.searchGroup}>
                <FaSearch
                onClick={handleSearch}
                className={styles.seachButton}
                />
                <input
                type="search"
                value={query}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search For a Drink"
                className={styles.searchInput}
                />
            </div>
            <div className={styles.authGroup}>
                {user ? (
                <>
                    <NavLink to="/create" className={styles.createButton}>
                    Create Something
                    </NavLink>
                    <LogoutButton />
                </>
                ) : (
                <>
                    <NavLink to="/login" className={styles.button}>Login</NavLink>
                    <NavLink to="/signup" className={styles.button}>Sign up</NavLink>
                </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;