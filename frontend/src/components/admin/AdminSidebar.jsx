import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. Import các component cần thiết từ Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faBox,
    faWarehouse,
    faHeadset,
    faFileInvoice,
    faCog,
    faSignOutAlt,
    // Thêm các icon khác bạn muốn dùng ở đây
} from '@fortawesome/free-solid-svg-icons';

// Component NavItem không đổi, nó sẽ nhận icon đã được import
const AdminNavItem = ({ to, icon, children }) => (
    <li>
        <NavLink
            to={to}
            className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'hover:bg-gray-700'}`}
        >
            {/* 2. Sử dụng component FontAwesomeIcon */}
            <FontAwesomeIcon icon={icon} className="fa-fw w-5 text-center" />
            <span>{children}</span>
        </NavLink>
    </li>
);

function AdminSidebar() {
    return (
        <aside className="w-64 bg-gray-800 text-gray-300 flex-shrink-0">
            <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTachometerAlt} className="text-white text-xl" />
                </div>
                <div><h1 className="text-xl font-bold text-white">PharmaCare</h1><p className="text-xs text-gray-400">Khu vực quản trị</p></div>
            </div>
            <nav className="p-4">
                <ul className="space-y-2 list-none">
                    <AdminNavItem to="/admin/dashboard" icon={faTachometerAlt}>Tổng quan</AdminNavItem>
                    <AdminNavItem to="/admin/don-hang" icon={faBox}>Quản lý Đơn hàng</AdminNavItem>
                    <AdminNavItem to="/admin/kho" icon={faWarehouse}>Quản lý Kho</AdminNavItem>
                    <AdminNavItem to="/admin/tu-van" icon={faHeadset}>Tư vấn khách hàng</AdminNavItem>
                    <AdminNavItem to="/admin/phieu-nhap-xuat" icon={faFileInvoice}>Phiếu nhập / xuất</AdminNavItem>
                    <AdminNavItem to="/admin/cai-dat" icon={faCog}>Cài đặt Nhà thuốc</AdminNavItem>
                    <li>
                        <a href="#" className="flex items-center space-x-3 p-3 rounded-lg mt-8 border-t border-gray-700 pt-3 hover:bg-gray-700">
                            <FontAwesomeIcon icon={faSignOutAlt} className="fa-fw w-5 text-center" />
                            <span>Đăng xuất</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default AdminSidebar;