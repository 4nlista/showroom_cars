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
        // Lưu đường dẫn hiện tại để redirect sau khi đăng nhập
        return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền admin nếu route yêu cầu
    if (adminOnly && user?.role_id !== 1) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
