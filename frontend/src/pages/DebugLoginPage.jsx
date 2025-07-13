import React from 'react';
import { useNavigate } from 'react-router-dom';

function DebugLoginPage() {
    const navigate = useNavigate();

    const loginAs = (role) => {
        const fakeToken = 'debug-token-for-react-app';
        let user = {};
        let redirectUrl = '/';

        if (role === 'thanh_vien') {
            user = { id: 100, hoTen: 'Thành Viên Test', email: 'member@test.com', vaiTro: 'thanh_vien' };
            redirectUrl = '/';
        } else if (role === 'nhan_vien') {
            user = { id: 200, hoTen: 'Nhân Viên Test', email: 'employee@test.com', vaiTro: 'nhan_vien' };
            redirectUrl = '/admin/dashboard';
        } else if (role === 'quan_tri_vien') {
            user = { id: 1, hoTen: 'Admin Test', email: 'admin@test.com', vaiTro: 'quan_tri_vien' };
            // Sửa lại route cho đúng với cấu trúc của Quản trị viên
            redirectUrl = '/admin/dashboard-admin';
        }

        localStorage.setItem('authToken', fakeToken);
        localStorage.setItem('user', JSON.stringify(user));

        alert(`Đã đăng nhập với vai trò: ${user.vaiTro}.`);
        navigate(redirectUrl);
        window.location.reload(); // Tải lại để app đọc localStorage mới
    };

    return (
        <div className="bg-gray-800 text-white flex items-center justify-center min-h-screen">
            <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center text-gray-800">
                <h1 className="text-3xl font-bold">Công cụ Đăng nhập nhanh</h1>
                <p className="text-gray-600 mt-2 mb-8">Chọn vai trò để kiểm tra giao diện.</p>

                <div className="space-y-4">
                    <button onClick={() => loginAs('thanh_vien')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Đăng nhập (THÀNH VIÊN)</button>
                    <button onClick={() => loginAs('nhan_vien')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Đăng nhập (NHÂN VIÊN)</button>
                    <button onClick={() => loginAs('quan_tri_vien')} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700">Đăng nhập (QUẢN TRỊ VIÊN)</button>
                </div>
            </div>
        </div>
    );
}

export default DebugLoginPage;