import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import DrinkCard from "../components/DrinkCard";
import Loading from "../components/Loading";
import Error from "../components/Error";

const LikedDrinks = () => {
    const [drinks, setDrinks] = useState(null);
    const [error, setError] = useState(null);

    const { user } = useAuth();
    
    useEffect(() => {
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
    }, []);
    return (
        <div>
            <h2>Your Liked Drinks</h2>
            
            {!drinks && !error && <Loading message="Loading all drinks..."/>}
            {error && <Error errormsg={error} />}
            {drinks && !error && (
                <div className="drink-list">
                    {drinks.map((drink) => (
                        <DrinkCard key={drink._id} drinkObj={drink} />
                        
                    ))}
                </div>
            )}
        </div>
    );
}

export default LikedDrinks;