import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import DrinkListField from './DrinkListField';
import ImageUploader from './ImageUploader';
import Error from '../components/Error';

import styles from '../styles/DrinkForm.module.css';

const DrinkForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Reset formData if initialData changes (e.g. after fetch)
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    // Generic handler for text, textarea, and checkbox
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
        await onSubmit(formData);
        } catch (err) {
        setError(err.message || 'Something went wrong');
        } finally {
        setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div>
            <Error errormsg={error} className={styles.errorBanner} />
        </div>}

        <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
            Name
            </label>
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            />
        </div>

        <DrinkListField
            label="Tags"
            values={formData.tags}
            placeholder="e.g. tiki"
            onChange={tags => setFormData(prev => ({ ...prev, tags }))}
        />

        <ImageUploader
            imageUrl={formData.imageUrl}
            onUpload={url => setFormData(prev => ({ ...prev, imageUrl: url }))}
        />
        <div className={styles.field}>
            <label className={styles.label} htmlFor="glassware">
                Glassware
            </label>
                <input
                className={styles.input}
                type="text"
                name="glassware"
                value={formData.glassware}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
            
        </div>
        <div className={styles.field}>
            <label className={styles.label} htmlFor="method">
                Method
            </label>
            <input
            className={styles.input}
            type="text"
            name="method"
            value={formData.method}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </div>

        <DrinkListField
            label="Ingredients"
            values={formData.ingredients}
            placeholder="e.g. 2 oz rum"
            onChange={ingredients => setFormData(prev => ({ ...prev, ingredients }))}
        />

        <DrinkListField
            label="Instructions"
            values={formData.instructions}
            placeholder="e.g. Shake with ice"
            onChange={instructions => setFormData(prev => ({ ...prev, instructions }))}
        />

        <div className={styles.field}>
        <label className={styles.label} htmlFor="description">
            Description
        </label>
            <textarea
            className={styles.textarea}
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </div>

        { user && user.username === "Tonic" && <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <input
            type="checkbox"
            name="isOfficial"
            checked={formData.isOfficial}
            onChange={handleChange}
            style={{ marginRight: '0.5rem' }}
            />
            Official Recipe?
        </label> }

        <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
        >
            {loading ? 'Saving…' : submitLabel}
        </button>
        <Link
            to="#"
            onClick={e => { 
            e.preventDefault(); 
            navigate(-1); 
            }}
            className={styles.cancelLink}
            >
            Cancel
        </Link>
        </form>
    );
}

export default DrinkForm;