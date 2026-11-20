import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// localStorage keys. The user info and the login token are saved separately.
const USER_KEY = 'tonicUser';
const TOKEN_KEY = 'tonicToken';

// Read saved values once, before the first render, so a refresh keeps you logged in.
// try/catch: localStorage can throw (e.g. blocked storage), and broken JSON shouldn't crash the app.
const getSavedUser = () => {
    try {
        const saved = localStorage.getItem(USER_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};
const getSavedToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    // user: the logged-in user's info (null when logged out)
    // token: the login token ("membership card") the server gave us at login
    const [user, setUser] = useState(getSavedUser);
    const [token, setToken] = useState(getSavedToken);

    // Keep localStorage in sync whenever user or token change
    useEffect(() => {
        try {
            if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
            else      localStorage.removeItem(USER_KEY);
            if (token) localStorage.setItem(TOKEN_KEY, token);
            else       localStorage.removeItem(TOKEN_KEY);
        } catch {
            // If storage is blocked, the app still works; you just won't stay logged in after a refresh
        }
    }, [user, token]);

    // Call after a successful login or signup
    const login = useCallback((newUser, newToken) => {
        setUser(newUser);
        setToken(newToken);
    }, []);

    // Call to log out. Forgetting the token is all it takes: with JWT the server keeps no list.
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    // fetch(), but for routes that need a login.
    // It adds the token to the request, and if the server answers 401
    // (token missing, fake or expired) it logs the user out with a message.
    // Use it like fetch: const res = await authFetch('/api/me');
    const authFetch = useCallback(async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                // The server's requireAuth middleware reads this header
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.status === 401) {
            logout();
            // `id` stops the same toast from showing twice if several requests fail at once
            toast.error('Your login expired. Please log in again.', { id: 'login-expired' });
        }
        return res;
    }, [token, logout]);

    // When the app first loads, check the saved login is still valid.
    useEffect(() => {
        // Saved user but no token = logged in before tokens existed. Log out quietly.
        if (user && !token) {
            logout();
            return;
        }
        if (!token) return;

        // Ask the server "who am I?". authFetch handles the 401 (expired) case by itself.
        const checkLogin = async () => {
            try {
                const res = await authFetch('/api/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user); // refresh with the latest info from the database
                }
            } catch {
                // Server unreachable: keep the saved login and try again next time
            }
        };
        checkLogin();
        // Empty array on purpose: only run once, when the app loads.
        // (Re-running on every token change would re-check right after each login, which is pointless.)
    }, []);

    return (
        // setUser is still shared because the like button updates user.likedDrinks.
        // For logging in and out, use login() and logout().
        <AuthContext.Provider value={{ user, setUser, token, login, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easier access to the AuthContext
export const useAuth = () => useContext(AuthContext);
