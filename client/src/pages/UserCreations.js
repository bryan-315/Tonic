import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DrinkCard from "../components/DrinkCard";
import Loading from "../components/Loading";
import Error from "../components/Error";

const UserCreations = () => {
    const [drinks, setDrinks] = useState(null);
    const [error, setError] = useState(null);
    const [drinksOwner, setDrinksOwner] = useState(null);
    
    const { userId } = useParams();

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const res = await fetch(`/api/user/${userId}/drinks`);
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || data.message || 'Unknown error');
                    setDrinks([]);
                } else {
                    setDrinks(data.drinks);
                    setDrinksOwner(data.drinks[0].createdBy.name || 'Unknown User');
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
            {!drinks && !error && <Loading message="Loading drinks..."/>}
            {error && <Error errormsg={error} />}
            {drinks && !error && (
                <div className="drink-list">
                    <h1>{drinksOwner}'s Creations</h1>
                    {drinks.map((drink) => (
                        <DrinkCard key={drink._id} drinkObj={drink} />
                        
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserCreations;