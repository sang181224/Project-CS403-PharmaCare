import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faChartLine, faUsersCog, faTruckLoading, faSignOutAlt, faPills } from '@fortawesome/free-solid-svg-icons';

// Component này nhận thêm prop 'onLogout'
function AdministratorSidebar({ onLogout }) {
    const NavItem = ({ to, icon, children }) => (
        <li><NavLink to={to} end className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700'}`}><FontAwesomeIcon icon={icon} className="fa-fw w-5" /><span>{children}</span></NavLink></li>
    );

    return (
        <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col">
            <nav className="p-4 flex-grow">
                <ul className="space-y-2 list-none p-0">
                    <NavItem to="/admin/dashboard-admin" icon={faTachometerAlt}>Tổng quan</NavItem>
                    <NavItem to="/admin/bao-cao" icon={faChartLine}>Phân tích & Báo cáo</NavItem>
                    <NavItem to="/admin/nhan-vien" icon={faUsersCog}>Quản lý Nhân viên</NavItem>
                    <NavItem to="/admin/nha-cung-cap" icon={faTruckLoading}>Quản lý Nhà cung cấp</NavItem>
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                {/* Nút Đăng xuất gọi hàm onLogout */}
                <button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700">
                    <FontAwesomeIcon icon={faSignOutAlt} className="fa-fw w-5" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}

export default AdministratorSidebar;