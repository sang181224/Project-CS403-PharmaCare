import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const token = localStorage.getItem('authToken');

    // Nếu có token (đã đăng nhập) -> cho phép truy cập
    // Nếu không, điều hướng về trang đăng nhập
    return token ? <Outlet /> : <Navigate to="/dang-nhap" />;
}

export default ProtectedRoute;