import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/global.css";

// Context Imports
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <AuthProvider>
        <SidebarProvider>
            <App />
        </SidebarProvider>
    </AuthProvider>

);