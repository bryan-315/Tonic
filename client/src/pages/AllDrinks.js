import { useEffect, useState } from "react";

import DrinkCard from "../components/DrinkCard";
import Loading from "../components/Loading";
import Error from "../components/Error";

const AllDrinks = () => {
    const [drinks, setDrinks] = useState(null);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const res = await fetch('/api/drinks');
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || data.message || 'Unknown error');
                    setDrinks([]);
                } else {
                    // Sort drinks alphabetically
                    const sortedDrinks = data.drinks.sort((a, b) =>
                        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
                    );
                    console.log('Fetched drinks:', sortedDrinks);
                    setDrinks(sortedDrinks);
                }
            } catch (networkErr) {
                // network‐level failure (DNS, offline, CORS, etc.)
                setError('Network error – please check your connection.');
                setDrinks([]);
            }
        };
        fetchDrinks();
    }, []);
    return (
        <div>
            <h1>All Drinks</h1>
            <p>This is ALL of the drinks in our records, sorted alphabetically</p>
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

export default AllDrinks;