import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import Loading from '../components/Loading';
import Error from '../components/Error';
import DrinkForm from '../components/DrinkForm';
import DeleteButton from '../components/DeleteButton';

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
        // Show success message
        toast.success('Drink updated successfully!');
        // Navigate to the updated drink's page
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
            <h2>Edit Drink Recipe</h2>
            {user && !error ? <>
                <DrinkForm
                initialData={initialData}
                onSubmit={handleUpdate}
                submitLabel="Update Drink" />
                <DeleteButton drinkId={drinkId} redirectPath={`/user/${user._id}/drinks`} />
            </>
            : <p>Please log in to edit recipes.</p>}
        </>
        );
        
};

export default EditDrink;

