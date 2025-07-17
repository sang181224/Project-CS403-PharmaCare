import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faChartLine,
    faUsersCog,
    faTruckLoading,
    faSignOutAlt,
    faPills
} from '@fortawesome/free-solid-svg-icons';

// Component NavItem dùng chung cho các mục menu
const AdminNavItem = ({ to, icon, children }) => (
    <li>
        <NavLink
            to={to}
            end
            className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
        >
            <FontAwesomeIcon icon={icon} className="fa-fw w-5 text-center" />
            <span>{children}</span>
        </NavLink>
    </li>
);

function AdministratorSidebar({ onLogout }) {
    return (
        <aside className="w-64 bg-gray-800 text-gray-300 flex-shrink-0 flex flex-col">

            {/* Header của Sidebar */}
            <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faPills} className="text-white text-xl" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">PharmaCare</h1>
                    <p className="text-xs text-gray-400">Super Admin</p>
                </div>
            </div>

            {/* Menu chính */}
            <nav className="p-4 flex-grow">
                <ul className="space-y-2 list-none p-0">
                    <AdminNavItem to="/admin/dashboard-admin" icon={faTachometerAlt}>Tổng quan</AdminNavItem>
                    <AdminNavItem to="/admin/bao-cao" icon={faChartLine}>Phân tích & Báo cáo</AdminNavItem>
                    <AdminNavItem to="/admin/nhan-vien" icon={faUsersCog}>Quản lý Nhân viên</AdminNavItem>
                    <AdminNavItem to="/admin/nha-cung-cap" icon={faTruckLoading}>Quản lý Nhà cung cấp</AdminNavItem>
                </ul>
            </nav>

            {/* Nút đăng xuất */}
            <div className="p-4 border-t border-gray-700">
                <button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">
                    <FontAwesomeIcon icon={faSignOutAlt} className="fa-fw w-5 text-center" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}

export default AdministratorSidebar;