import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';

import Loading from '../components/Loading';
import Error from '../components/Error';
import DrinkForm from '../components/DrinkForm';

const CLOUD_NAME = 'djijwros2';
const UPLOAD_PRESET = 'tonic_unsigned';

const EditDrink = () => {
    const { drinkId } = useParams();
    const { user }    = useAuth();
    const navigate    = useNavigate();

    const [initialData, setInitialData] = useState(null);
    const [error,       setError]       = useState('');

    // Fetch existing drink on mount
    useEffect(() => {
        const loadDrink = async () => {
            try {
            const res  = await fetch(`/api/drinks/${drinkId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message);
    
            setInitialData({
                name:         data.drink.name,
                tags:         data.drink.tags,
                imageUrl:     data.drink.imageUrl || '',
                glassware:    data.drink.glassware || '',
                method:       data.drink.method || '',
                ingredients:  data.drink.ingredients,
                instructions: data.drink.instructions,
                description:  data.drink.description || '',
                isOfficial:   data.drink.isOfficial,
            });
            } catch (err) {
            setError(err.message);
            }
        };
        loadDrink();
        }, [drinkId]);
    
        // Update handler
        const handleUpdate = async (formData) => {
        const drinkObj = {
            authorId:    user._id,
            username:    user.username,
            name:        formData.name,
            tags:        formData.tags.filter(t => t.trim()),
            imageUrl:    formData.imageUrl || undefined,
            glassware:   formData.glassware || undefined,
            method:      formData.method || undefined,
            ingredients: formData.ingredients.filter(i => i.trim()),
            instructions:formData.instructions.filter(i => i.trim()),
            description: formData.description,
            isOfficial:  formData.isOfficial,
        };
    
        const res = await fetch(`/api/drinks/${drinkId}`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body:    JSON.stringify(drinkObj),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to update drink');
        }
        navigate(`/drinks/${data.drink._id}`);
        };
    
        if (!user) {
        return <p>Please log in to edit recipes.</p>;
        }
        if (error) {
        return <Error errormsg={error} />;
        }
        if (!initialData) {
        return <Loading message="Loading recipe..." />;
        }
    
        return (
        <>
            <h1>Edit Drink Recipe</h1>
            {user && !error ? <DrinkForm
                initialData={initialData}
                onSubmit={handleUpdate}
                submitLabel="Update Drink"
            />
            : <p>Please log in to edit recipes.</p>}
        </>
        );
};

export default EditDrink;





/*const EditDrink = () => {
    const { drinkId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState({
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
    const [loading, setLoading] = useState(true);

    if (!user) {
        return <p>Please log in to create a new recipe.</p>;
    }

    useEffect(() => {
        const loadDrink = async () => {
            try {
                const res  = await fetch(`/api/drinks/${drinkId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || data.message);
        
                // Populate formData with the existing values:
                setFormData({
                name:         data.drink.name,
                tags:         data.drink.tags,
                imageUrl:     data.drink.imageUrl || '',
                glassware:    data.drink.glassware || '',
                method:       data.drink.method || '',
                ingredients:  data.drink.ingredients,
                instructions: data.drink.instructions,
                description:  data.drink.description || '',
                isOfficial:   data.drink.isOfficial,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            };
            loadDrink();
        }, [drinkId]);

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
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*':[]} });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
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

        const res = await fetch(`/api/drinks/${drinkId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(drinkObj),
        });
        const data = await res.json();
        if (!res.ok) {
            console.error('Error posting drink:', data, user.username, user._id);
            throw new Error(data.error || 'Failed to post drink');
        }
        console.log('Drink updated successfully:', data);
        // Redirect to the drink page after successful update
        

        navigate(`/drinks/${data.drink._id}`);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    if (loading && !error) {
        return <Loading />;
    }
    if (error) {
        return <Error errormsg={error} />;
    }
    // Render the form
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '2rem auto' }}>
        <h1>Modify Your Recipe</h1>
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
            <legend>Tags *</legend>
            {formData.tags.map((tag, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                type="text"
                value={formData.tags[idx]}
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
            {formData.imageUrl && (
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', marginTop: '1rem', borderRadius: '4px' }}>
                    <img
                    src={formData.imageUrl}
                    alt="preview"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                        }}
                    />
                </div>
                )}
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
            {loading ? 'Updating...' : 'Update Drink'}
        </button>
        </form>
    );
};


export default EditDrink;*/