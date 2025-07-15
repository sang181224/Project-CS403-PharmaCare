import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHome,
  faSearch,
  faUserPlus,
  faSignInAlt,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const NavItem = ({ to, icon, children }) => (
  <li>
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-100 ${
          isActive ? "bg-blue-50 text-blue-600" : ""
        }`
      }
    >
      <FontAwesomeIcon icon={icon} className="fa-fw w-5 text-center" />
      <span>{children}</span>
    </NavLink>
  </li>
);

function Sidebar() {
  const location = useLocation();

  if (location.pathname === "/product") {
    return null;
  }
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Menu chính</h3>
      </div>
      <nav className="p-4">
        <ul className="space-y-2 list-none">
          <NavItem to="/" icon={faHome}>
            Trang chủ
          </NavItem>
          <NavItem to="/product" icon={faBoxOpen}>
            Sản Phẩm
          </NavItem>
          <NavItem to="/tim-kiem" icon={faSearch}>
            Tìm kiếm thuốc
          </NavItem>
          <NavItem to="/dang-ky" icon={faUserPlus}>
            Đăng ký
          </NavItem>
          <NavItem to="/dang-nhap" icon={faSignInAlt}>
            Đăng nhập
          </NavItem>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
