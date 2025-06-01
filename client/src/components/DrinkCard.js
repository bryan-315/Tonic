import { Link } from "react-router-dom";

import SmallImg from "./SmallImg";
import OfficialBadge from "./OfficialBadge";

import styles from "../styles/DrinkCard.module.css";

const DrinkCard = ({ drinkObj }) => {
    const { _id, name, imageUrl, tags, createdBy, createdAt, isOfficial } = drinkObj;
    return (
        <Link to={`/drinks/${drinkObj._id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.drinkCard}>
                {isOfficial && <OfficialBadge />}
                <SmallImg 
                url={imageUrl || '/TonicPlaceholder.png'}
                alt={name || 'Drink Image'}
                />
                <p className={styles.name}>
                    {name}
                </p>
                {createdBy && 
                <p className={styles.info}>
                    Created by: {createdBy.name}
                </p>}
                <p className={styles.info}>
                    Added on {new Date(createdAt).toLocaleDateString()}
                </p>
                {tags && <ul className={styles.tags}>
                    {tags.map((tag, index) => (
                        <li key={index} className={styles.tag}>
                            {tag}
                        </li>
                    ))}    
                </ul>}
            </div>
        </Link>
    )
}

export default DrinkCard;