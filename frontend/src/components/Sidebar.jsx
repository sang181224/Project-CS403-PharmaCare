import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBoxOpen, // Thay icon faSearch bằng faBoxOpen
  faUserPlus,
  faSignInAlt,
  faUserCircle,
  faSignOutAlt,
  faComments
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
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Menu chính</h3>
      </div>

      <nav className="p-4 flex-grow">
        <ul className="space-y-2 list-none p-0">
          <NavItem to="/" icon={faHome}>Trang chủ</NavItem>
          <NavItem to="/product" icon={faBoxOpen}>Sản phẩm</NavItem>
          <NavItem to="/tu-van" icon={faComments}>Tư vấn</NavItem>
          {!user && (
            <>
              <NavItem to="/dang-ky" icon={faUserPlus}>Đăng ký</NavItem>
              <NavItem to="/dang-nhap" icon={faSignInAlt}>Đăng nhập</NavItem>
            </>
          )}

          {user && user.vaiTro === 'thanh_vien' && (
            <NavItem to="/tai-khoan/don-hang" icon={faUserCircle}>Tài khoản của tôi</NavItem>
          )}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
