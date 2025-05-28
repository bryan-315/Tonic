import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DrinkCard from "../components/DrinkCard";
import Loading from "../components/Loading";
import Error from "../components/Error";

const AllDrinks = () => {
    const [drinks, setDrinks] = useState(null);
    const [error, setError] = useState(null);
    
    // Code for search params
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const query = (params.get("q") || "").trim().toLowerCase();

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
                    setDrinks(sortedDrinks);
                }
            } catch (networkErr) {
                // network‐level failure (DNS, offline, CORS, etc.)
                setError('Network error - please check your connection.');
                setDrinks([]);
            }
        };
        fetchDrinks();
    }, []);

    const filtered = drinks
    ? (query
        ? drinks.filter(d =>
            d.name.toLowerCase().includes(query) ||
            d.tags.some(tag => tag.toLowerCase().includes(query))
        )
        : drinks)
    : null;
    console.log("Filtered drinks:", filtered);

    return (
        <div>
            <h1>
                {query
                ? `Search results for “${query}”`
                : "All Drinks"}
            </h1>
            <p>
                {query && filtered
                ? `Found ${filtered.length} drink${filtered.length !== 1 ? "s" : ""} matching “${query}”.`
                : "This is ALL of the drinks in our records, sorted alphabetically."}
            </p>

            {!drinks && !error && <Loading message="Loading all drinks..." />}
            {error && <Error errormsg={error} />}
        
            {filtered && !error && (
                <div className="drink-list">
                {filtered.map(drink => (
                    <DrinkCard key={drink._id} drinkObj={drink} />
                ))}
                </div>
            )}
            </div>
        );
}

export default AllDrinks;