import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

import { useAuth } from '../contexts/AuthContext';
//import styles from './Sidebar.module.css'; // your future CSS module

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    
    return (
        <div className={''}>
        {/* Toggle button */}
        <button
            className={''}
            onClick={() => setIsOpen(open => !open)}
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
            {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Sidebar panel */}
        <nav className={''}>
            {/* In here you could map a list of RecipeCards or Links */}
            <ul className={''}>
                <li>
                    <NavLink to="/" className="active">
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/all-drinks" className="active">
                        All Drinks
                    </NavLink>
                </li>
                {user && <>
                    <li>
                        <NavLink to={`/user/${  user._id}/drinks`} className="active">
                            My Drinks
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink to="/liked-drinks" className="active">
                            Liked Drinks
                        </NavLink>
                    </li>
                </>}
            </ul>
            {children}
        </nav>
        </div>
    );
};

export default Sidebar;