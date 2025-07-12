import React from 'react';

function AdminHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
            <div className="max-w-full mx-auto px-6">
                <div className="flex justify-between items-center py-3">
                    <div className="flex items-center space-x-3">
                        {/* Có thể thêm Breadcrumbs hoặc Title ở đây sau */}
                    </div>
                    <div className="flex items-center space-x-3">
                        <img className="w-10 h-10 rounded-full" src={`https://via.placeholder.com/100/D1D5DB/4B5563?text=${user?.hoTen?.charAt(0)}`} alt="Avatar" />
                        <div>
                            <p className="text-sm font-medium text-gray-800">{user?.hoTen || 'Nhân viên'}</p>
                            <p className="text-xs text-gray-600 capitalize">{user?.vaiTro?.replace('_', ' ') || 'Chưa rõ'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;