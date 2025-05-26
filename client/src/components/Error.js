import React from 'react';
//import styles from './Loading.module.css';


const Error = ({ errormsg = 'default error msg', className = '' }) => (
    <div>
        <p>{errormsg}</p>
    </div>
);

export default Error;
