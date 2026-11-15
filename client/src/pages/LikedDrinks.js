import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import DrinkCard from "../components/DrinkCard";
import Loading from "../components/Loading";
import Error from "../components/Error";

import styles from "../styles/ManyDrinkPage.module.css";

const LikedDrinks = () => {
    const [drinks, setDrinks] = useState(null);
    const [error, setError] = useState(null);

    const { user } = useAuth();
    
    useEffect(() => {
        //logged out: no user to look up so dont request to server
        if (!user) return;
        const fetchDrinks = async () => {
            try {
                const res = await fetch(`/api/user/${user._id}/liked`);
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || data.message || 'Unknown error');
                    setDrinks([]);
                } else {
                    setDrinks(data.drinks);
                }
            } catch (networkErr) {
                // network‐level failure (DNS, offline, CORS, etc.)
                console.error(networkErr);
                setError('Network error - please check your connection.');
                setDrinks([]);
            }
        };
        fetchDrinks();
    }, [user]);

    //show to client that is not logged in
    if (!user) {
        return <p className={styles.emptyMessage}><Link to="/login">Log in</Link> to see your liked drinks.</p>;
    }

    return (
        <div>
            <div className={styles.header}>
                <h2>Your Liked Drinks</h2>
            </div>
            {!drinks && !error && <Loading message="Loading all drinks..."/>}
            {error && <Error errormsg={error} />}
            {drinks && !error && drinks.length === 0 && <p className={styles.emptyMessage}>No liked recipes have been found</p>}
            {drinks && !error && (
                <div className={styles.drinkList}>
                    {drinks.map((drink) => (
                        <DrinkCard key={drink._id} drinkObj={drink} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LikedDrinks;