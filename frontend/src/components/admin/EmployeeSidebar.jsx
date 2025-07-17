import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faBox,
    faWarehouse,
    faHeadset,
    faFileInvoice,
    faCog,
    faSignOutAlt,
    faPills,
    faReceipt
} from '@fortawesome/free-solid-svg-icons';

// Component NavItem dùng chung cho các mục menu
const NavItem = ({ to, icon, children }) => (
    <li>
        <NavLink
            to={to}
            end // Đảm bảo chỉ active khi đường dẫn chính xác (quan trọng cho Dashboard)
            className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
        >
            <FontAwesomeIcon icon={icon} className="fa-fw w-5 text-center" />
            <span>{children}</span>
        </NavLink>
    </li>
);


function EmployeeSidebar({ onLogout }) {
    return (
        // Sử dụng flex-col để đẩy nút Đăng xuất xuống dưới
        <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col flex-shrink-0">
            {/* Menu chính, dùng flex-grow để nó chiếm hết không gian ở giữa */}
            <nav className="p-4 flex-grow">
                <ul className="space-y-2 list-none p-0">
                    <NavItem to="/admin/dashboard" icon={faTachometerAlt}>Tổng quan</NavItem>
                    <NavItem to="/admin/don-hang" icon={faBox}>Quản lý Đơn hàng</NavItem>
                    <NavItem to="/admin/hoa-don" icon={faReceipt}>Quản lý Hóa đơn</NavItem>
                    <NavItem to="/admin/kho" icon={faWarehouse}>Quản lý Kho</NavItem>
                    <NavItem to="/admin/tu-van" icon={faHeadset}>Tư vấn khách hàng</NavItem>
                    <NavItem to="/admin/phieu-nhap-xuat" icon={faFileInvoice}>Phiếu nhập / xuất</NavItem>
                    <NavItem to="/admin/cai-dat" icon={faCog}>Cài đặt Nhà thuốc</NavItem>
                </ul>
            </nav>

            {/* Nút đăng xuất luôn ở dưới cùng */}
            <div className="p-4 border-t border-gray-700">
                <button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">
                    <FontAwesomeIcon icon={faSignOutAlt} className="fa-fw w-5 text-center" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}

export default EmployeeSidebar;