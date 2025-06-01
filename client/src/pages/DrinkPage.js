import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


import LikeDiv from '../components/LikeDiv';
import Loading from '../components/Loading';
import Error from '../components/Error';
import BigImg from '../components/BigImg'; 

import styles from '../styles/DrinkPage.module.css';

const DrinkPage = () => {

    const { drinkId } = useParams();
    const { user } = useAuth();
    const [ drink, setDrink ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchDrink = async () => {
            try {
                const res = await fetch(`/api/drinks/${drinkId}`);
                const data = await res.json();
                if (!res.ok) {
                setError(data.error || data.message || 'Unknown error');
                setDrink(null);
                } else {
                setDrink(data.drink);
                }
            } catch (networkErr) {
                // network‐level failure (DNS, offline, CORS, etc.)
                console.error(networkErr);
                setError('Network error - please check your connection.');
                setDrink(null);
            }
        };
        fetchDrink();
    }, []);
    
    const isOwner = user && drink && user._id === drink.createdBy.id;
    return (
            <div className={styles.drinkPage}>
        {/* Loading / Error */}
        {!drink && !error && (
            <Loading message="Loading drink info..." />
        )}
        {error && <Error errormsg={error} />}

        {/* Main content */}
        {drink && !error && (
            <>
            {/* Title */}
            <h2 className={styles.title}>{drink.name}</h2>

            {/* Edit button (if owner) */}
            {isOwner && (
                <Link
                to={`/drinks/${drinkId}/edit`}
                className={styles.editButton}
                >
                Edit Recipe
                </Link>
            )}

            {/* LikeDiv or login prompt */}
            <div className={styles.likeWrapper}>
                {user ? (
                <LikeDiv
                    drinkId={drinkId}
                    initialCount={drink.likes}
                    initialLiked={user.likedDrinks?.some(
                    (id) => id === drink._id
                    )}
                />
                ) : (
                <p>
                    <Link to="/login">Log in</Link> to like this drink
                </p>
                )}
            </div>

            {/* Flex container: details on the left, image on the right */}
            <div className={styles.mainContent}>
                {/* Left column: all details */}
                <div className={styles.details}>
                {/* Glassware & Method (if present) */}
                <div className={styles.section}>
                    {drink.glassware && (
                    <p>
                        <strong>Glassware:</strong> {drink.glassware}
                    </p>
                    )}
                    {drink.method && (
                    <p>
                        <strong>Method:</strong> {drink.method}
                    </p>
                    )}
                </div>

                {/* Ingredients */}
                <section className={styles.section}>
                    <h2>Ingredients</h2>
                    <ul>
                    {drink.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                    ))}
                    </ul>
                </section>

                {/* Instructions */}
                <section className={styles.section}>
                    <h2>Instructions</h2>
                    <ol>
                    {drink.instructions.map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                    </ol>
                </section>

                {/* Description */}
                {drink.description && (
                    <section
                    className={`${styles.section} ${styles.descriptionBox}`}
                    >
                    <h3>Description</h3>
                    <p>{drink.description}</p>
                    </section>
                )}

                {/* Tags as pills */}
                <section className={styles.section}>
                    <h3>Tags</h3>
                    <div className={styles.tags}>
                    {drink.tags.map((tag, idx) => (
                        <span key={idx} className={styles.tag}>
                        {tag}
                        </span>
                    ))}
                    </div>
                </section>

                {/* Creator & Date */}
                <section className={styles.section}>
                    <p className={styles.metadata}>
                    <strong>Created by:</strong>{' '}
                    <Link to={`/user/${drink.createdBy.id}/drinks`}>
                        {drink.createdBy.name}
                    </Link>
                    </p>
                    <p className={styles.metadata}>
                    <strong>Created at:</strong>{' '}
                    {new Date(drink.createdAt).toLocaleDateString()}
                    </p>
                </section>
                </div>

                {/* Right column: the big image */}
                <div className={styles.imageContainer}>
                <BigImg
                    url={drink.imageUrl || '/TonicPlaceholder.png'}
                    alt={drink.name || 'Drink Image'}
                />
                </div>
            </div>
            </>
        )}
        </div>
    );
}

export default DrinkPage;
