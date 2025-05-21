


const Login = () => {
    return (
        <div>
            <h1>Login to Your Tonic Account</h1>
            <form>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;