import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateDrink = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        tags: '',            // comma-separated
        imageUrl: '',        // optional
        glassware: '',       // optional
        method: '',          // optional
        ingredients: '',     // comma-separated
        instructions: '',    // comma-separated
        description: '',
        isOfficial: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if not logged in
    if (!user) {
        return <p>Please log in to create a new recipe.</p>;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        const {
            name,
            tags,
            imageUrl,
            glassware,
            method,
            ingredients,
            instructions,
            description,
            isOfficial,
        } = formData;

        // Parse comma-separated fields into arrays
        const tagsArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
        const ingredientsArr = ingredients.split(',').map((i) => i.trim()).filter(Boolean);
        const instructionsArr = instructions.split(',').map((i) => i.trim()).filter(Boolean);

        const payload = {
            authorId: user._id,
            username: user.name,
            name,
            tags: tagsArr,
            imageUrl: imageUrl || undefined,
            glassware: glassware || undefined,
            method: method || undefined,
            ingredients: ingredientsArr,
            instructions: instructionsArr,
            description,
            isOfficial,
        };

        const res = await fetch('/api/drinks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // if you switch to cookie auth later
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to post drink');
        }

        // Success! Redirect to home or drink details
        navigate('/');
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto' }}>
        <h1>Create a New Drink</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>
            Drink Name *
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            />
        </label>

        <label>
            Tags * (comma-separated)
            <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. tiki, rum, summer"
            required
            />
        </label>

        <label>
            Image URL (optional)
            <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            />
        </label>

        <label>
            Glassware (optional)
            <input
            type="text"
            name="glassware"
            value={formData.glassware}
            onChange={handleChange}
            />
        </label>

        <label>
            Method (optional)
            <input
            type="text"
            name="method"
            value={formData.method}
            onChange={handleChange}
            />
        </label>

        <label>
            Ingredients * (comma-separated)
            <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="e.g. 2 oz rum, 1 oz lime juice, 1 tsp sugar"
            required
            />
        </label>

        <label>
            Instructions * (comma-separated)
            <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="e.g. Shake with ice, Strain into glass, Garnish with mint"
            required
            />
        </label>

        <label>
            Description
            <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            />
        </label>

        <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
            type="checkbox"
            name="isOfficial"
            checked={formData.isOfficial}
            onChange={handleChange}
            />
            <span style={{ marginLeft: '0.5rem' }}>Official Recipe?</span>
        </label>

        <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Drink'}
        </button>
        </form>
    );
};

export default CreateDrink;