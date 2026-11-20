import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import Loading from '../components/Loading';
import { servingText, macrosText } from '../utils/ingredientText';

import styles from '../styles/Ingredients.module.css';

// "My Ingredients": the logged-in user's saved ingredients, A to Z.
// Handles the four list states: loading, error, empty, results.
const MyIngredients = () => {
    // Hooks first, before any early return
    const { user, authFetch } = useAuth();
    const [ingredients, setIngredients] = useState(null); // null = still loading
    const [error, setError] = useState('');
    // Depend on the ID, not the whole user object: the app refreshes `user` once on load
    // (a new object with the same ID), and that shouldn't trigger a second fetch
    const userId = user?._id;

    useEffect(() => {
        // Logged out: nothing to load (the page shows a login prompt instead)
        if (!userId) return;

        const loadIngredients = async () => {
            setError('');
            try {
                // authFetch adds the login token; the server knows whose list to send from it
                const res = await authFetch('/api/ingredients');
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Could not load your ingredients.');
                setIngredients(data.ingredients);
            } catch (err) {
                setError(err.message === 'Failed to fetch'
                    ? 'Network error - is the server running?'
                    : err.message);
            }
        };
        loadIngredients();
    }, [userId, authFetch]); // re-run if a different user logs in, or the token changes

    if (!user) {
        return (
            <p className={styles.prompt}>
                <Link to="/login">Log in</Link> to see your ingredients.
            </p>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.heading}>My Ingredients</h2>
                <Link to="/ingredients/new" className={styles.newBtn}>+ New</Link>
            </div>

            {/* 1. Error */}
            {error && <p className={styles.errorBox} role="alert">{error}</p>}

            {/* 2. Loading */}
            {!error && ingredients === null && <Loading message="Loading your ingredients..." />}

            {/* 3. Empty */}
            {!error && ingredients && ingredients.length === 0 && (
                <p className={styles.empty}>
                    No ingredients yet.<br />
                    Add the things you eat often, like oats, eggs or your protein powder.
                </p>
            )}

            {/* 4. Results: each card opens the edit page */}
            {!error && ingredients && ingredients.length > 0 && (
                <ul className={styles.list}>
                    {ingredients.map((ingredient) => (
                        <li key={ingredient._id}>
                            <Link to={`/ingredients/${ingredient._id}/edit`} className={styles.card}>
                                <p className={styles.name}>{ingredient.name}</p>
                                <p className={styles.serving}>{servingText(ingredient.serving)}</p>
                                <p className={styles.macros}>{macrosText(ingredient)}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyIngredients;
