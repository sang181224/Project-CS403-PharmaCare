import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

// Component nhận thêm prop 'variant', mặc định là 'public'
function Header({ variant = 'public' }) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center py-3">
          
          {/* Logo & Tên hệ thống (Luôn hiển thị) */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <NavLink to="/"><FontAwesomeIcon icon={faPills} className="text-white text-xl" /></NavLink>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PharmaCare</h1>
              <p className="text-xs text-gray-500">Hệ thống quản lý nhà thuốc</p>
            </div>
          </div>

          {/* Phần bên phải của Header */}
          <div className="flex items-center space-x-6">
            
            {/* Chỉ hiển thị Tìm kiếm & Giỏ hàng nếu là trang public */}
            {variant === 'public' && (
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <input type="text" placeholder="Tìm kiếm thuốc...." className="w-64 pl-4 pr-10 py-2 border rounded-full text-sm" />
                  <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <div className="relative">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-2xl text-gray-600 cursor-pointer" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
                </div>
              </div>
            )}

            {/* Thông tin người dùng (Luôn hiển thị) */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{user ? user.hoTen : 'Khách vãng lai'}</p>
                <p className="text-xs text-gray-600">{user ? (user.vaiTro || 'Thành viên').replace('_', ' ') : 'Chưa đăng nhập'}</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;