import { useAuth } from "../contexts/AuthContext";


const Home = () => {
    const { user } = useAuth();
    return (
        <div>
            <p>Your one-stop solution for all your tonic needs!</p>
            {user && <p>Welcome, {user.username}</p>}
        </div>
    );
}

export default Home;