import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/Auth.module.css";

import LogoutButton from "../components/LogoutButton";

const Login = () => {
    // States/Hooks
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    // Functions
    const handleInputChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { email, password } = input;
        // Basic validation
        if (!email || !password) {
            setError("All fields are required.");
            return;
        }
        try {
            const res = await fetch('/user/login', {
                method: 'POST',
                // for cookies later credentials: 'include'
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                // Handle error
                console.error(data.message);
                setLoading(false);
                setError(data.message || 'Login failed');
                throw new Error(data.message || 'Login failed');
            }
            // Successful login
            setLoading(false);
            setUser(data.data);
            navigate('/');
        } catch (err) {
            setLoading(false);
            // Handle error
            console.error(err);
            setError(err.message || 'Login failed');
        }
        };

    return (
        <div className={styles.authWrapper}>
        {!user && 
        <>
            <h2 className={styles.authHeading}>Login to Your Tonic Account</h2>
            <form onSubmit={handleLogin} className={styles.authForm}>
            {error && <p className={styles.errorMsg}>{error}</p>}
                <div className={styles.formRow}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formRow}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                <input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                />
                </div>
                <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
                >
                    {loading ? "Logging in..." : "Log in"}
                </button>
                {/*{!loading && <button type="submit">Log in</button>}
                {loading && <button disabled>Loading...</button>}*/}
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </form>
        </>}
        {user && <div>
            <h1>You are logged in as: {user.username}!</h1>
            <LogoutButton />
            <Link to="/">Go to Home</Link>
        </div>}
        </div>
    );
};

export default Login;