import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Function to get saved user from localStorage before the component mounts
const getSavedUser = () => {
    const saved = localStorage.getItem('tonicUser');
    return saved ? JSON.parse(saved) : null;
};
    
export const AuthProvider = ({ children }) => {
    // State to hold the user object
    // This will be null if the user is not logged in
    const [user, setUser] = useState(getSavedUser);

    // Save changes to localStorage
    useEffect(() => {
    if (user) localStorage.setItem('tonicUser', JSON.stringify(user));
    else    localStorage.removeItem('tonicUser');
    }, [user]);

    return (
    <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>
    );
};

// Custom hook for easier access to the AuthContext
export const useAuth = () => useContext(AuthContext);
