import{ useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

import styles from '../styles/LikeDiv.module.css';

const LikeDiv = ({ drinkId, initialCount = 0, initialLiked = false  }) => {
    const [ liked, setLiked ] = useState(initialLiked);
    const [ count, setCount ] = useState(initialCount);
    const [ loading, setLoading ] = useState(false);

    const { user, setUser } = useAuth();

    const handleToggle = async () => {
        if (loading) return;
        setLoading(true);
        const endpoint = `/api/drinks/${drinkId}/${liked ? 'unlike' : 'like'}`;
        try {
            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ authorId: user._id }),
                });
                const data = await res.json();
                if (res.ok) {
                    setLiked(!liked);
                    setCount(prev => (liked ? prev - 1 : prev + 1));

                    // Update user context
                    setUser(prev => {
                        if (!prev) return prev; // If no user, just return
                        const updatedLikedDrinks = liked 
                            ? prev.likedDrinks.filter(id => id !== drinkId)
                            : [...prev.likedDrinks, drinkId];
                        return { ...prev, likedDrinks: updatedLikedDrinks };
                    });
                } else {
                    console.error('Error toggling like:', data.error || data.message);
                }
        } catch (err) {
            console.error('Network error:', err);
        } finally {
            setLoading(false);
        }
    } 

    return (
        <button 
        onClick={handleToggle} 
        disabled={loading} 
        aria-pressed={liked}
        className={`${styles.button} ${liked ? styles.liked : ''}`}
        >
            {liked ? <>
                <span>Remove from favorites</span>
                <span className={styles.icon}><FaHeart /></span>
            </>
            :
            <>
                <span>Add to favorites</span>
                <span className={styles.icon}><FaRegHeart /></span>
            </>}
            <span className={styles.count}>{count}</span>
        </button>
    )
}

export default LikeDiv;