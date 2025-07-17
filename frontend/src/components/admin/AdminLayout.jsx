import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header'; // <-- DÙNG LẠI HEADER CHUNG
import EmployeeSidebar from './EmployeeSidebar';
import AdministratorSidebar from './AdministratorSidebar';
import { useAuth } from '../../context/AuthContext';

function AdminLayout() {
    const { user, logout } = useAuth();
    
    if (!user) return null; // ProtectedRoute sẽ xử lý chuyển hướng

    // Quyết định sidebar nào sẽ được hiển thị
    const SidebarComponent = user.vaiTro === 'quan_tri_vien' 
        ? <AdministratorSidebar onLogout={logout} /> 
        : <EmployeeSidebar onLogout={logout} />;

    // CẤU TRÚC MỚI: Header ở trên, Sidebar và Nội dung ở dưới
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header /> {/* SỬ DỤNG HEADER CHUNG Ở ĐÂY */}
            <div className="flex flex-1">
                {SidebarComponent}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;