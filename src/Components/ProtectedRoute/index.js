import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const ProtectedRoute = ({ children }) => {
    const token = Cookies.get('token');
    console.log(`User Jwt-Token ${token}`); 

    
    if (!token) {
        return <Navigate to="/login" />;
    }

    
    return children;
};

export default ProtectedRoute;