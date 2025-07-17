import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faUserPlus,
  faSignInAlt,
  faUserCircle,
  faSignOutAlt,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const NavItem = ({ to, icon, children }) => (
  <li>
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
        }`}
    >
      <FontAwesomeIcon icon={icon} className="fa-fw w-5 text-center" />
      <span>{children}</span>
    </NavLink>
  </li>
);

function Sidebar() {
  // 2. Lấy thông tin user và hàm logout từ context
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Menu chính</h3>
      </div>

      <nav className="p-4 flex-grow">
        <ul className="space-y-2 list-none p-0">
          <NavItem to="/" icon={faHome}>Trang chủ</NavItem>
          <NavItem to="/product" icon={faBoxOpen}>Sản Phẩm</NavItem>
          <NavItem to="/tim-kiem" icon={faSearch}>Tìm kiếm thuốc</NavItem>

          {/* 3. Dùng điều kiện để render menu */}
          {/* Nếu KHÔNG có user -> Hiển thị Đăng ký/Đăng nhập */}
          {!user && (
            <>
              <NavItem to="/dang-ky" icon={faUserPlus}>Đăng ký</NavItem>
              <NavItem to="/dang-nhap" icon={faSignInAlt}>Đăng nhập</NavItem>
            </>
          )}

          {/* Nếu CÓ user -> Hiển thị Tài khoản của tôi */}
          {user && (
            <NavItem to="/tai-khoan" icon={faUserCircle}>Tài khoản của tôi</NavItem>
          )}
        </ul>
      </nav>

      {/* 4. Hiển thị nút đăng xuất nếu đã đăng nhập */}
      {user && (
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="fa-fw w-5 text-center" />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;