// React/Hook Imports
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// CSS Imports
import { NavLink } from 'react-router-dom';
//import './Navbar.css'; // Optional: Add custom styles for your navbar

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
            navigate(`/?q=${encodeURIComponent(trimmed)}`);
        }
        // Implement search functionality here
    }

    return (
        <nav className="navbar">
            <NavLink to="/">
                <h1>Tonic</h1>
            </NavLink>
            <div>
                <FaSearch
                onClick={handleSearch}
                />
                <input
                type="search"
                value={query}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search For a Drink"
                />
            </div>
            {user && <p>Welcome, {user.username}</p>}
            {user && <NavLink to="/profile">
                {user.name}
            </NavLink>}
            {user && <LogoutButton />}
            {!user && <NavLink to="login">
                Log in
            </NavLink>}
            {!user && <NavLink to="signup">
                Sign up
            </NavLink>}
        </nav>
    );
};

export default Navbar;