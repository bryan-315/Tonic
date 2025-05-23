import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
    const [message, setMessage] = useState("");
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
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
            if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
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
                navigate('/');
        } catch (err) {
                setError(err.message);
        }
    }

    return (
        <div className="signup">
            <h1>Create a new Tonic account</h1>
            <form onSubmit={handleSubmit}>
                <label>
                Username
                <input
                    type="text"
                    name="username"
                    value={input.username}
                    onChange={handleInputChange}
                    required
                />
                </label>
                <label>
                Email
                <input
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={handleInputChange}
                    required
                />
                </label>
                <label>
                Password
                <input
                    type="password"
                    name="password"
                    value={input.password}
                    onChange={handleInputChange}
                    required
                />
                </label>
                <label>
                Confirm Password
                <input
                    type="password"
                    name="confirmPassword"
                    value={input.confirmPassword}
                    onChange={handleInputChange}
                    required
                />
                </label>
                <button type="submit">Sign up</button>
            </form>
            <p>{message}</p>
        </div>
    )
};

export default Signup;