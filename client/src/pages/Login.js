import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext" 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoutButton from "../components/LogoutButton";

const Login = () => {
    const { user, setUser } = useAuth();
    const handleLogin = async (email, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
            // data.user looks like { _id, name, email }
            setUser(data.user);      // put it in React Context
            } else {
            // handle error
            console.error(data.message);
            }
        };

    return (
        <>
        {!user && <div>
            <h1>Login to Your Tonic Account</h1>
            <form>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button type="submit">Login</button>
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