
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import your LikeButton component when ready
// import LikeButton from '../components/LikeButton';

import LikeDiv from '../components/LikeDiv';
import Loading from '../components/Loading';
import Error from '../components/Error';
import BigImg from '../components/BigImg'; 

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
                setError('Network error - please check your connection.');
                setDrink(null);
            }
        };
        fetchDrink();
    }, []);
    
    const isOwner = user && drink && user._id === drink.createdBy.id;
    return (
        <div>
            {!drink && !error && <Loading message='Loading drink info...'/>}
            {error && <Error errormsg={error}/>}
            {drink && !error && 
                <div>
                    <h1>{drink.name}</h1>
                    {isOwner && <Link to={`/drinks/${drinkId}/edit`} className="btn btn-edit">
                        Edit Recipe
                    </Link>
                    }
                    <div>
                        {user ? <LikeDiv 
                        drinkId={drinkId}
                        initialCount={drink.likes}
                        initialLiked={user?.likedDrinks?.some(id => id === drink._id)}
                        />
                        :
                        <p><Link to="/login">Log in</Link> to like this drink</p>}
                    </div>
                    <div>
                        <BigImg
                            url={drink.imageUrl || 'https://via.placeholder.com/300'}
                            alt={drink.name}
                            
                        />
                    </div>
                    <div>
                        {drink.glassware && <p><strong>Glassware:</strong> {drink.glassware}</p>}
                        {drink.method && <p><strong>Method:</strong> {drink.method}</p>}

                        {/* Ingredients */}
                        <section>
                        <h2>Ingredients</h2>
                        <ul>
                            {drink.ingredients.map((ing, idx) => (
                            <li key={idx}>{ing}</li>
                            ))}
                        </ul>
                        </section>

                        {/* Instructions */}
                        <section>
                        <h2>Instructions</h2>
                        <ol>
                            {drink.instructions.map((step, idx) => (
                            <li key={idx}>{step}</li>
                            ))}
                        </ol>
                        </section>

                        {/* Description & Tags at bottom */}
                        {drink.description && (
                        <section>
                            <h3>Description</h3>
                            <p>{drink.description}</p>
                        </section>
                        )}
                        
                        <section>
                            <h3>Tags</h3>
                            <p>{drink.tags.join(', ')}</p>
                        </section>
                        {/* Creator & Date */}
                        <section>
                        <p><strong>Created by:</strong> <Link to={`/user/${drink.createdBy.id}/drinks`}>{drink.createdBy.name}</Link></p>
                        <p><strong>Created at:</strong> {new Date(drink.createdAt).toLocaleDateString()}</p>
                        </section>
                    </div>
                
                </div>
            }
        </div>
    );
}

export default DrinkPage;
