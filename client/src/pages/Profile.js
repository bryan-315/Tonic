import React from 'react';

const Profile = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Profile Page</h1>
            <div style={styles.profileCard}>
                <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    style={styles.profileImage}
                />
                <h2 style={styles.name}>Your Name</h2>
                <p style={styles.bio}>This is a short bio about yourself.</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    header: {
        fontSize: '2rem',
        marginBottom: '20px',
    },
    profileCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        width: '300px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    profileImage: {
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        marginBottom: '15px',
    },
    name: {
        fontSize: '1.5rem',
        marginBottom: '10px',
    },
    bio: {
        fontSize: '1rem',
        textAlign: 'center',
        color: '#555',
    },
};

export default Profile;