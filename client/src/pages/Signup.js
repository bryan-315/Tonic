import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import styles from "../styles/Auth.module.css"

const Signup = () => {
    // States/Hooks
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Functions
    const handleInputChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        const { username, email, password, confirmPassword } = input;
        // Basic validation, no checking the db required yet.
        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
            if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        //basic check done, now can connect to db and check for duplicates before creating account
        //setLoading is done after under the basic validation so that the button does not get stuck if it fails
        setLoading(true);
        try {
            const res = await fetch('/user/signup', {
                method: 'POST',
                // for cookies later credentials: 'include'
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, confirmPassword }),
                });
                const data = await res.json();
                if (!res.ok) {
                    // Handle error
                    console.error(data.message);
                    setError(data.message || 'Signup failed');
                throw new Error(data.message || 'Signup failed');
                }
                
                // Successful signup
                setUser(data.user);
                // Show success message
                toast.success("Account created successfully!");
                // Redirect to home page
                navigate('/');
        } catch (err) {
                setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.authWrapper}>
            <h2 className={styles.authHeading}>Create a new Tonic account</h2>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <div className={styles.formRow}>
                    <label className={styles.label}>
                    Username
                    <input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                    />
                    </label>
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                    />
                    </label>
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                    />
                    </label>
                </div>
                <div className={styles.formRow}>
                    <label className={styles.label}>
                    Confirm Password
                    <input
                        type="password"
                        name="confirmPassword"
                        value={input.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                    />
                    </label>
                </div>
                {error && <p className={styles.errorMsg}>{error}</p>}
                <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>
            </form>
        </div>
    )
};

export default Signup;