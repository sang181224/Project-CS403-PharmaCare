import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import EmployeeSidebar from './EmployeeSidebar';
import AdministratorSidebar from './AdministratorSidebar';

function AdminLayout() {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    let user = null;

    if (userString) {
        try { user = JSON.parse(userString); } catch (error) {
            console.error("Lỗi đọc dữ liệu người dùng:", error);
            localStorage.clear();
            navigate('/dang-nhap');
        }
    }

    if (!user) { return <div>Đang kiểm tra quyền truy cập...</div>; }

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        alert('Bạn đã đăng xuất.');
        navigate('/dang-nhap');
    };

    // Quyết định sidebar nào sẽ được hiển thị và truyền hàm logout vào
    const SidebarToShow = user?.vaiTro === 'quan_tri_vien'
        ? <AdministratorSidebar onLogout={handleLogout} />
        : <EmployeeSidebar onLogout={handleLogout} />;

    return (
        <div className="flex h-screen bg-gray-100">
            {SidebarToShow}
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;