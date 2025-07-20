import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header'; // <-- Sử dụng lại Header chung
import EmployeeSidebar from './EmployeeSidebar';
import AdministratorSidebar from './AdministratorSidebar';
import { useAuth } from '../../context/AuthContext';

function AdminLayout() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const SidebarToShow = user.vaiTro === 'quan_tri_vien'
        ? <AdministratorSidebar onLogout={logout} />
        : <EmployeeSidebar onLogout={logout} />;

    return (
        // Cấu trúc layout mới: Header ở trên, Sidebar và Nội dung ở dưới
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header variant="admin" /> {/* SỬ DỤNG HEADER CHUNG VỚI VARIANT ADMIN */}
            <div className="flex flex-1">
                {SidebarToShow}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;