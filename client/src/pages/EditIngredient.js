import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

import Loading from '../components/Loading';
import IngredientForm, { ingredientToForm } from '../components/IngredientForm';

import styles from '../styles/Ingredients.module.css';

const EditIngredient = () => {
    // Hooks first, before any early return
    const { id } = useParams();
    const { user, authFetch } = useAuth();
    const navigate = useNavigate();

    const [ingredient, setIngredient] = useState(null); // the saved ingredient (null = loading)
    const [formData, setFormData] = useState(null);     // the same data, as form text
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);
    // Depend on the ID, not the whole user object (see MyIngredients.js for why)
    const userId = user?._id;

    // Load the ingredient to edit
    useEffect(() => {
        if (!userId) return;

        const loadIngredient = async () => {
            setError('');
            try {
                const res = await authFetch(`/api/ingredients/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Could not load this ingredient.');
                setIngredient(data.ingredient);
                setFormData(ingredientToForm(data.ingredient));
            } catch (err) {
                setError(err.message === 'Failed to fetch'
                    ? 'Network error - is the server running?'
                    : err.message);
            }
        };
        loadIngredient();
    }, [id, userId, authFetch]);

    // Save changes. Throwing an Error makes the form show its message.
    const handleUpdate = async (payload) => {
        const res = await authFetch(`/api/ingredients/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not save your changes.');

        toast.success(`${data.ingredient.name} updated!`);
        navigate('/ingredients');
    };

    const handleDelete = async () => {
        // Simple confirm for now. In Feature 4 (recipes) this becomes the
        // "used in 2 recipes" choice, since deleting will affect recipes.
        if (!window.confirm(`Delete ${ingredient.name}? This can't be undone.`)) return;

        setDeleting(true);
        try {
            const res = await authFetch(`/api/ingredients/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Could not delete this ingredient.');

            toast.success(`${ingredient.name} deleted`);
            navigate('/ingredients');
        } catch (err) {
            toast.error(err.message);
            setDeleting(false);
        }
    };

    if (!user) {
        return (
            <p className={styles.prompt}>
                <Link to="/login">Log in</Link> to edit your ingredients.
            </p>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <p className={styles.errorBox} role="alert">{error}</p>
                <p className={styles.prompt}><Link to="/ingredients">Back to my ingredients</Link></p>
            </div>
        );
    }

    if (!formData) {
        return <Loading message="Loading ingredient..." />;
    }

    return (
        <div className={styles.page}>
            <h2 className={styles.heading}>Edit {ingredient.name}</h2>
            <br />
            <IngredientForm
                initialData={formData}
                onSubmit={handleUpdate}
                submitLabel="Save changes"
            />

            <div className={styles.dangerZone}>
                <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? 'Deleting…' : 'Delete ingredient'}
                </button>
            </div>
        </div>
    );
};

export default EditIngredient;
