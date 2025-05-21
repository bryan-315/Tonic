


const Signup = () => {
    return (
        <div className="signup">
            <h1>Create a new Tonic account</h1>
            <form>
                <input type="text" placeholder="Username" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <input type="password" placeholder="Confirm Password" required />
                <button type="submit">Create Account</button>
            </form>
        </div>
    )
};

export default Signup;