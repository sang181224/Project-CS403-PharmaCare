import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBox, faWarehouse, faHeadset, faFileInvoice, faCog, faSignOutAlt, faPills } from '@fortawesome/free-solid-svg-icons';

// Component này cũng nhận prop 'onLogout'
function EmployeeSidebar({ onLogout }) {
    const NavItem = ({ to, icon, children }) => (
        <li><NavLink to={to} end className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}><FontAwesomeIcon icon={icon} className="fa-fw w-5" /><span>{children}</span></NavLink></li>
    );

    return (
        <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><FontAwesomeIcon icon={faPills} className="text-white text-xl" /></div>
                <div><h1 className="text-xl font-bold text-white">PharmaCare</h1><p className="text-xs text-gray-400">Khu vực Nhân viên</p></div>
            </div>
            <nav className="p-4 flex-grow">
                <ul className="space-y-2 list-none">
                    <NavItem to="/admin/dashboard" icon={faTachometerAlt}>Tổng quan</NavItem>
                    <NavItem to="/admin/don-hang" icon={faBox}>Quản lý Đơn hàng</NavItem>
                    <NavItem to="/admin/kho" icon={faWarehouse}>Quản lý Kho</NavItem>
                    <NavItem to="/admin/tu-van" icon={faHeadset}>Tư vấn khách hàng</NavItem>
                    <NavItem to="/admin/phieu-nhap-xuat" icon={faFileInvoice}>Phiếu nhập / xuất</NavItem>
                    <NavItem to="/admin/cai-dat" icon={faCog}>Cài đặt Nhà thuốc</NavItem>
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

export default EmployeeSidebar;