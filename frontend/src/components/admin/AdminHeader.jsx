import React from 'react';
import { useAuth } from '../../context/AuthContext';

function AdminHeader() {
    const { user } = useAuth();

    const avatarInitial = user?.hoTen ? user.hoTen.charAt(0).toUpperCase() : '?';
    const avatarColor = user?.vaiTro === 'quan_tri_vien' ? 'ring-purple-500' : 'ring-blue-500';

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-full mx-auto px-6">
                <div className="flex justify-end items-center py-3">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 ring-2 ${avatarColor}`}>
                            {avatarInitial}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{user?.hoTen || 'Không rõ'}</p>
                            <p className="text-xs text-gray-600 capitalize">{user?.vaiTro?.replace('_', ' ') || 'Không rõ'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;