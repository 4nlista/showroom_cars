import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CarProgressLoading from './all-components/CarProgressLoading';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <CarProgressLoading />;
    }

    if (!isAuthenticated) {
        // Save current path to redirect after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check admin permission if route requires it
    if (adminOnly && user?.role_id !== 1) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
