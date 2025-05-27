import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

//import ImageUploader from '../components/ImageUploader';
//import DrinkListField from '../components/DrinkListField';
import DrinkForm from '../components/DrinkForm';


const blankData = {
    name: '',
    tags: [''],
    imageUrl: '',
    glassware: '',
    method: '',
    ingredients: [''],
    instructions: [''],
    description: '',
    isOfficial: false,
    };
    
const CreateDrink = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
    const drinkObj = {
        authorId: user._id,
        username: user.username,
        name: formData.name,
        tags: formData.tags.filter(t => t.trim()),
        imageUrl: formData.imageUrl || undefined,
        glassware: formData.glassware || undefined,
        method: formData.method || undefined,
        ingredients: formData.ingredients.filter(i => i.trim()),
        instructions: formData.instructions.filter(i => i.trim()),
        description: formData.description,
        isOfficial: formData.isOfficial,
    };

    const res = await fetch('/api/drinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(drinkObj),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Failed to post drink');
    }

    navigate(`/drinks/${data.drink._id}`);
    };

    if (!user) {
    return <p>Please log in to create a new recipe.</p>;
    }

    return (
        <DrinkForm
            initialData={blankData}
            onSubmit={handleCreate}
            submitLabel="Post Drink"
        />
    );
};

export default CreateDrink;
//const CreateDrink = () => {
//    const { user } = useAuth();
//    const navigate = useNavigate();
//    const [ formData, setFormData ] = useState({
//        name: '',
//        tags: [''],
//        imageUrl: '',        // will store secure URL from Cloudinary
//        glassware: '',       // optional
//        method: '',          // optional
//        ingredients: [''],   
//        instructions: [''],  
//        description: '',
//        isOfficial: false,
//    });
//    const [error, setError] = useState('');
//    const [loading, setLoading] = useState(false);
//
//    if (!user) {
//        return <p>Please log in to create a new recipe.</p>;
//    }
//
//    const handleChangeSimple = (e) => {
//        const { name, value, type, checked } = e.target;
//        setFormData(prev => ({
//        ...prev,
//        [name]: type === 'checkbox' ? checked : value,
//        }));
//    };
//
//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        setError('');
//        setLoading(true);
//
//        try {
//        const drinkObj = {
//            authorId: user._id,
//            username: user.username,
//            name: formData.name,
//            tags: formData.tags.filter(t => t.trim()),
//            imageUrl: formData.imageUrl || undefined,
//            glassware: formData.glassware || undefined,
//            method: formData.method || undefined,
//            ingredients: formData.ingredients.filter(i => i.trim()),
//            instructions: formData.instructions.filter(i => i.trim()),
//            description: formData.description,
//            isOfficial: formData.isOfficial,
//        };
//
//        const res = await fetch('/api/drinks', {
//            method: 'POST',
//            headers: { 'Content-Type': 'application/json' },
//            credentials: 'include',
//            body: JSON.stringify(drinkObj),
//        });
//        const data = await res.json();
//        if (!res.ok) {
//            console.error('Error posting drink:', data, user.username, user._id);
//            throw new Error(data.error || 'Failed to post drink');
//        }
//        console.log('Drink posted successfully:', data);
//        navigate(`/drinks/${data.drink._id}`);
//        } catch (err) {
//        setError(err.message);
//        } finally {
//        setLoading(false);
//        }
//    };
//
//    return (
//        <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto' }}>
//        <h1>Create a New Drink</h1>
//        {error && <p style={{ color: 'red' }}>{error}</p>}
//
//        <label>
//            Drink Name
//            <input
//            type="text"
//            name="name"
//            value={formData.name}
//            onChange={handleChangeSimple}
//            required
//            />
//        </label>
//
//        <DrinkListField
//            label="Tags"
//            values={formData.tags}
//            onChange={(newTags) => setFormData(prev => ({ ...prev, tags: newTags }))}
//            placeholder="e.g. Sweet, Sour"
//        />
//
//        <ImageUploader
//            imageUrl={formData.imageUrl}
//            onUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
//        />
//
//        <label>
//            Glassware (optional)
//            <input
//            type="text"
//            name="glassware"
//            value={formData.glassware}
//            onChange={handleChangeSimple}
//            />
//        </label>
//
//        <label>
//            Method (optional)
//            <input
//            type="text"
//            name="method"
//            value={formData.method}
//            onChange={handleChangeSimple}
//            />
//        </label>
//
//        <DrinkListField
//            label="Ingredients"
//            values={formData.ingredients}
//            onChange={(newIngredients) => setFormData(prev => ({ ...prev, ingredients: newIngredients }))}
//            placeholder="e.g. 2 oz Raspberry Syrup"
//        />
//
//        <DrinkListField
//            label="Instructions"
//            values={formData.instructions}
//            onChange={(newInstructions) => setFormData(prev => ({ ...prev, instructions: newInstructions }))}
//            placeholder="e.g. Shake with ice"
//        />
//
//        <label>
//            Description
//            <textarea
//            name="description"
//            value={formData.description}
//            onChange={handleChangeSimple}
//            />
//        </label>
//
//        <label style={{ display: 'flex', alignItems: 'center' }}>
//            <input
//            type="checkbox"
//            name="isOfficial"
//            checked={formData.isOfficial}
//            onChange={handleChangeSimple}
//            />
//            <span style={{ marginLeft: '0.5rem' }}>Official Recipe?</span>
//        </label>
//
//        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
//            {loading ? 'Posting...' : 'Post Drink'}
//        </button>
//        
//        </form>
//
//    );
//};
//
//export default CreateDrink;
//