import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();


    return (
        <main>
        <section className="hero">
            <h2>Tonic Homepage</h2>
            <h2>Discover or create some great drinks with other thirsty people.</h2>
            
        </section>

        <section className="quick-links">
            <Link to="/all-drinks" className="card">Browse All Drinks</Link>
            {user && <>
                <h3>Welcome, {user.username}</h3>
                <Link to={`/user/${user._id}/drinks`} className="card">My Drinks</Link>
                <Link to="/liked-drinks" className="card">Liked Drinks</Link>
                </>}
            {!user && 
                <Link to="/login" className="card">Log in to view your saved/created recipes</Link>
            }
        </section>

        {user && <section className="cta">
            <h2>Have a great recipe?</h2>
            <Link to="/create" className="btn-primary">Create Your Drink</Link>
        </section>}
    </main>
    );
}

export default Home;