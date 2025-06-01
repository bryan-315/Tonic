import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import styles from "../styles/Home.module.css";

const Home = () => {
    const { user } = useAuth();

    return (
        <main className={styles.homeWrapper}>
            <section className={styles.hero}>
                <h2>Tonic Homepage</h2>
                <h2>Save and share your best recipes with others.</h2>
            </section>

            <section className={styles.quickLinks}>
                <Link to="/all-drinks" className={styles.card}>Browse All Recipes</Link>
                {user && <>
                    <h3 className={styles.welcome}>Welcome, {user.username}</h3>
                    <Link to={`/user/${user._id}/drinks`} className={styles.card}>My Recipes</Link>
                    <Link to="/liked-drinks" className={styles.card}>Liked Recipes</Link>
                    </>}
                {!user && 
                    <Link to="/login" className={styles.card}>Log in to view your saved/created recipes</Link>
                }
            </section>

            {user && <section className={styles.cta}>
                <h2>Have a great recipe?</h2>
                <Link to="/create" className={styles.btnPrimary}>Create Your Drink</Link>
            </section>}
        </main>
    );
}

export default Home;