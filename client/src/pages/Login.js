import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <>
        {!user && <div>
            <h2>Login to Your Tonic Account</h2>
            <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                />
                {!loading && <button type="submit">Log in</button>}
                {loading && <button disabled>Loading...</button>}
                
            </form>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>}
        {user && <div>
            <h1>You are logged in as: {user.name}!</h1>
            <LogoutButton />
            <Link to="/">Go to Home</Link>
        </div>}
        </>

    );
};

export default Login;