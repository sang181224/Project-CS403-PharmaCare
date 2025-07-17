import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faUser } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const { user } = useAuth(); // Lấy thông tin user từ context

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
            <div className="max-w-full mx-auto px-6">
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faPills} className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">PharmaCare</h1>
                            <p className="text-xs text-gray-500">Hệ thống quản lý nhà thuốc</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-blue-600 text-lg" />
                        </div>
                        <div>
                            {/* Hiển thị động dựa trên user từ context */}
                            <p className="text-sm font-medium text-gray-800">{user ? user.hoTen : 'Khách vãng lai'}</p>
                            <p className="text-xs text-gray-600">{user ? user.email : 'Chưa đăng nhập'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;