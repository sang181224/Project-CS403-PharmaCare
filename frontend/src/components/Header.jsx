import React, { useState, useEffect, useRef } from 'react';
// THÊM 'Link' VÀO DÒNG IMPORT NÀY
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faUser, faShoppingCart, faSearch, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

function Header({ variant = 'public' }) {
  const { user, logout } = useAuth();
  const { cart, cartItemCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Xử lý đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product?search=${searchTerm}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <NavLink to="/"><FontAwesomeIcon icon={faPills} className="text-white text-xl" /></NavLink>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PharmaCare</h1>
              <p className="text-xs text-gray-500">Hệ thống quản lý nhà thuốc</p>
            </div>
          </div>

          {/* Phần bên phải */}
          <div className="flex items-center space-x-6">
            {variant === 'public' && (
              <div className="flex items-center space-x-6">
                <form onSubmit={handleSearch} className="relative hidden md:block">
                  <input type="text" placeholder="Tìm kiếm thuốc...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 pl-4 pr-10 py-2 border rounded-full text-sm" />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"><FontAwesomeIcon icon={faSearch} /></button>
                </form>
                <div className="relative">
                  <NavLink to="/cart"><FontAwesomeIcon icon={faShoppingCart} className="text-2xl text-gray-600" /></NavLink>
                  {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>}
                </div>
              </div>
            )}

            {/* Thông tin người dùng và Menu Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 text-left">{user ? user.hoTen : 'Khách vãng lai'}</p>
                  <p className="text-xs text-gray-600 capitalize text-left">{user ? (user.vaiTro || 'Thành viên').replace('_', ' ') : 'Chưa đăng nhập'}</p>
                </div>
              </button>

              {/* Menu Dropdown */}
              {isProfileMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  {user.vaiTro === 'thanh_vien' && (
                    <Link to="/tai-khoan/don-hang" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                      Tài khoản của tôi
                    </Link>
                  )}
                  <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;