//import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaHome } from 'react-icons/fa';

import styles from '../styles/Sidebar.module.css'; 

import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
//import styles from './Sidebar.module.css'; // your future CSS module

const Sidebar = ({ children }) => {
    //const [isOpen, setIsOpen] = useState(false);
    const { isOpen, toggle } = useSidebar();
    const { user } = useAuth();
    
    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.expanded : styles.collapsed}`}>
            <button
                className={styles.toggleBtn}
                onClick={toggle}
                aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            {isOpen && <nav className={styles.nav}>
                {/* In here you could map a list of RecipeCards or Links */}
                <ul className={styles.navList}>
                    <li>
                        <NavLink to="/"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                        }>
                        <FaHome />
                        { isOpen && <span className={isOpen ? styles.linkText : styles.linkTextHidden}>
                        Home
                        </span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/all-drinks" 
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                        }>
                            <span className={isOpen ? styles.linkText : styles.linkTextHidden}>
                            All Drinks
                            </span>
                        </NavLink>
                    </li>
                    {user && <>
                        <li>
                            <NavLink to={`/user/${  user._id}/drinks`} 
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                            }>
                                <span className={isOpen ? styles.linkText : styles.linkTextHidden}>
                                    My Drinks
                                </span>
                            </NavLink>
                        </li>
                        
                        <li>
                            <NavLink to="/liked-drinks" 
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                            }>
                                <span className={isOpen ? styles.linkText : styles.linkTextHidden}>
                                    Liked Drinks
                                </span>
                            </NavLink>
                        </li>
                    </>}
                </ul>
                {children}
            </nav>}
        </div>
    );
};

export default Sidebar;