import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

import IngredientForm, { blankIngredientForm } from '../components/IngredientForm';

import styles from '../styles/Ingredients.module.css';

const CreateIngredient = () => {
    const { user, authFetch } = useAuth();
    const navigate = useNavigate();

    // Called by IngredientForm with the cleaned-up form data.
    // Throwing an Error makes the form show its message.
    const handleCreate = async (payload) => {
        const res = await authFetch('/api/ingredients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not save the ingredient.');

        toast.success(`${data.ingredient.name} saved!`);
        navigate('/ingredients');
    };

    if (!user) {
        return (
            <p className={styles.prompt}>
                <Link to="/login">Log in</Link> to add ingredients.
            </p>
        );
    }

    return (
        <div className={styles.page}>
            <h2 className={styles.heading}>New ingredient</h2>
            <br />
            <IngredientForm
                initialData={blankIngredientForm}
                onSubmit={handleCreate}
                submitLabel="Save ingredient"
            />
        </div>
    );
};

export default CreateIngredient;
