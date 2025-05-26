import React from 'react';
//import styles from './Loading.module.css';


const Loading = ({ message = 'Loading...', className = '' }) => (
    <div>
        <p>{message}</p>
    </div>
);

export default Loading;
