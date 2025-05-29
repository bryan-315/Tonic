import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const CLOUD_NAME    = 'djijwros2';
const UPLOAD_PRESET = 'tonic_unsigned';
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const ImageUploader = ({ imageUrl, onUpload }) => {
    const onDrop = useCallback(async files => {
        const file = files[0];
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', UPLOAD_PRESET);
        try {
            const res = await fetch(UPLOAD_URL, { method: 'POST', body: data });
            const json = await res.json();
            if (!res.ok) {
                toast.error(json.error?.message || 'Failed to upload image');
                return;
            }
            onUpload(json.secure_url);
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.message || 'Network error uploading image');
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
    });

    return (
        <fieldset>
        <legend>Image (optional)</legend>
        <div
            {...getRootProps()}
            style={{ border: '2px dashed #aaa', padding: '1rem', textAlign: 'center' }}
        >
            <input {...getInputProps()} />
            {isDragActive
            ? 'Drop the image here…'
            : 'Drag & drop an image, or click to select'}
        </div>
        {imageUrl && (
            <div style={{ marginTop: '1rem' }}>
            <img
                src={imageUrl}
                alt="preview"
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '400px',
                    objectFit: 'cover'
                    }}
            />
            </div>
        )}
        </fieldset>
    );
}

export default ImageUploader;