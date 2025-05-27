import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import SmallImg from "./SmallImg";


const DrinkCard = ({ drinkObj }) => {
    console.log('DrinkCard', drinkObj);
    const { _id, name, imageUrl, tags, createdBy, createdAt } = drinkObj;
    console.log(tags)
    return (
        <Link to={`/drinks/${drinkObj._id}`}>
            <div className="drink-card">
                <SmallImg 
                url={imageUrl || 'https://via.placeholder.com/300'}
                alt={name}
                />
                <p>{name}</p>
                {createdBy && <p>Created by: {createdBy.name}</p>}
                <p>Added on{new Date(createdAt).toLocaleDateString()}</p>
                {tags && <ul>
                    {tags.map((tag, index) => (
                        <li key={index} className="tag">
                            {tag}
                        </li>
                    ))}    
                </ul>}
            </div>
        </Link>
    )
}

export default DrinkCard;