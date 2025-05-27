import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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
    // Show success message
    toast.success('Drink created successfully!');
    // Navigate to the new drink's page
    navigate(`/drinks/${data.drink._id}`);
    };


    return (
        <>
            {user ? <>
            <h1>Create a New Drink</h1>
            <DrinkForm
                initialData={blankData}
                onSubmit={handleCreate}
                submitLabel="Post Drink"
            />
            </> :
            <p><Link to="/login">Log in</Link> to create a new recipe</p>
            }
        </>
    );
};

export default CreateDrink;
