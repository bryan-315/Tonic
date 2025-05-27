import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DrinkListField from './DrinkListField';
import ImageUploader from './ImageUploader';
import Error from '../components/Error';

const DrinkForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
        <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto' }}>
        {error && <Error errormsg={error} />}


        <label style={{ display: 'block', marginBottom: '1rem' }}>
            Name
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </label>

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

        <label style={{ display: 'block', marginBottom: '1rem' }}>
            Glassware
            <input
            type="text"
            name="glassware"
            value={formData.glassware}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </label>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
            Method
            <input
            type="text"
            name="method"
            value={formData.method}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </label>

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

        <label style={{ display: 'block', marginBottom: '1rem' }}>
            Description
            <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <input
            type="checkbox"
            name="isOfficial"
            checked={formData.isOfficial}
            onChange={handleChange}
            style={{ marginRight: '0.5rem' }}
            />
            Official Recipe?
        </label>

        <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}
        >
            {loading ? 'Saving…' : submitLabel}
        </button>
        <Link
            to="#"
            onClick={e => { 
            e.preventDefault(); 
            navigate(-1); 
            }}
            style={{ fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}>
            Cancel
        </Link>
        </form>
    );
}

export default DrinkForm;