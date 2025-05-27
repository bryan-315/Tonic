import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DeleteButton = ({ drinkId, redirectPath = '/all-drinks' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;

        try {
        const res = await fetch(`/api/drinks/${drinkId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ authorId: user._id }),
        });
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Failed to delete');
        }

        // Show success message
        toast.success('Recipe deleted successfully!');
        // Navigate after successful deletion
        navigate(redirectPath);
        } catch (err) {
        alert(err.message);
        }
    };

    return (
        <button
        type="button"
        onClick={handleDelete}
        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
        Delete This Recipe
        </button>
    );
}

export default DeleteButton;