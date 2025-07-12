// src/components/Header.jsx
import React from 'react';

function Header() {
    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
            <div className="max-w-full mx-auto px-6">
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <i className="fas fa-pills text-white text-xl"></i>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">PharmaCare</h1>
                            <p className="text-xs text-gray-500">Hệ thống quản lý nhà thuốc</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i id="user-avatar" className="fas fa-user text-blue-600 text-lg"></i>
                        </div>
                        <div>
                            <p id="user-name" className="text-sm font-medium text-gray-800">Khách vãng lai</p>
                            <p id="user-role" className="text-xs text-gray-600">Chưa đăng nhập</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;