import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AccountNavItem = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => `block p-3 rounded-lg ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
        {children}
    </NavLink>
);

function AccountLayout() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tài khoản của tôi</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <nav className="space-y-2">
                            <AccountNavItem to="/tai-khoan/don-hang">Lịch sử đơn hàng</AccountNavItem>
                            <AccountNavItem to="/tai-khoan/thong-tin">Thông tin cá nhân</AccountNavItem>
                        </nav>
                    </div>
                </aside>
                <main className="md:col-span-3">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
export default AccountLayout;