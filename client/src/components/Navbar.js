// src/pages/CreateDrink.js
import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const CLOUD_NAME = '<YOUR_CLOUD_NAME>';         // replace with your Cloudinary cloud name
const UPLOAD_PRESET = '<YOUR_UPLOAD_PRESET>';   // replace with your unsigned upload preset

const CreateDrink = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        tags: [''],
        imageUrl: '',        // will store secure URL from Cloudinary
        glassware: '',       // optional
        method: '',          // optional
        ingredients: [''],   
        instructions: [''],  
        description: '',
        isOfficial: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <p>Please log in to create a new recipe.</p>;
    }

    const handleFieldChange = (field, index) => (e) => {
        const value = e.target.value;
        setFormData(prev => {
        const updatedArray = [...prev[field]];
        updatedArray[index] = value;
        return { ...prev, [field]: updatedArray };
        });
    };

    const handleAddField = (field) => () => {
        setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ''],
        }));
    };

    const handleRemoveField = (field, index) => () => {
        setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleChangeSimple = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Dropzone for image upload
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', UPLOAD_PRESET);
        try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            { method: 'POST', body: data }
        );
        const json = await res.json();
        setFormData(prev => ({ ...prev, imageUrl: json.secure_url }));
        } catch (err) {
        console.error('Image upload error:', err);
        setError('Failed to upload image');
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        const payload = {
            authorId: user._id,
            username: user.name,
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
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to post drink');
        }

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
            Drink Name
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChangeSimple}
            required
            />
        </label>

        <fieldset>
            <legend>Tags to make your drink more searchable</legend>
            {formData.tags.map((tag, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                type="text"
                value={tag}
                onChange={handleFieldChange('tags', idx)}
                placeholder="e.g. tiki"
                required={idx === 0}
                style={{ flex: 1 }}
                />
                {formData.tags.length > 1 && (
                <button type="button" onClick={handleRemoveField('tags', idx)} style={{ marginLeft: '0.5rem' }}>
                    ×
                </button>
                )}
            </div>
            ))}
            <button type="button" onClick={handleAddField('tags')}>
            + Add Tag
            </button>
        </fieldset>

        <fieldset>
            <legend>Image (optional)</legend>
            <div {...getRootProps()} style={{ border: '2px dashed #aaa', padding: '1rem', textAlign: 'center' }}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop an image, or click to select</p>}
            </div>
            {formData.imageUrl && <img src={formData.imageUrl} alt="preview" style={{ width: '100%', marginTop: '1rem' }} />}
        </fieldset>

        <label>
            Glassware (optional)
            <input
            type="text"
            name="glassware"
            value={formData.glassware}
            onChange={handleChangeSimple}
            />
        </label>

        <label>
            Method (optional)
            <input
            type="text"
            name="method"
            value={formData.method}
            onChange={handleChangeSimple}
            />
        </label>

        <fieldset>
            <legend>Ingredients *</legend>
            {formData.ingredients.map((ing, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                type="text"
                value={ing}
                onChange={handleFieldChange('ingredients', idx)}
                placeholder="e.g. 2 oz rum"
                required={idx === 0}
                style={{ flex: 1 }}
                />
                {formData.ingredients.length > 1 && (
                <button type="button" onClick={handleRemoveField('ingredients', idx)} style={{ marginLeft: '0.5rem' }}>
                    ×
                </button>
                )}
            </div>
            ))}
            <button type="button" onClick={handleAddField('ingredients')}>
            + Add Ingredient
            </button>
        </fieldset>

        <fieldset>
            <legend>Instructions *</legend>
            {formData.instructions.map((inst, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                type="text"
                value={inst}
                onChange={handleFieldChange('instructions', idx)}
                placeholder="e.g. Shake with ice"
                required={idx === 0}
                style={{ flex: 1 }}
                />
                {formData.instructions.length > 1 && (
                <button type="button" onClick={handleRemoveField('instructions', idx)} style={{ marginLeft: '0.5rem' }}>
                    ×
                </button>
                )}
            </div>
            ))}
            <button type="button" onClick={handleAddField('instructions')}>
            + Add Step
            </button>
        </fieldset>

        <label>
            Description
            <textarea
            name="description"
            value={formData.description}
            onChange={handleChangeSimple}
            />
        </label>

        <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
            type="checkbox"
            name="isOfficial"
            checked={formData.isOfficial}
            onChange={handleChangeSimple}
            />
            <span style={{ marginLeft: '0.5rem' }}>Official Recipe?</span>
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Posting...' : 'Post Drink'}
        </button>
        </form>
    );
};

export default CreateDrink;
