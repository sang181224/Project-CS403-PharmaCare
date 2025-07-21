import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function DebugLoginPage() {
    const navigate = useNavigate();

    const loginAs = async (role) => {
        try {
            // Gọi đến API debug mới để lấy token thật
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/debug/login-as-role`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: role })
            });

            const result = await response.json();

            if (response.ok) {
                // Lưu token thật và user thật vào localStorage
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                toast.success(`Đã đăng nhập với vai trò: ${result.user.vaiTro}.`);

                // Chuyển hướng đến đúng trang
                let redirectUrl = '/';
                if (role === 'nhan_vien') redirectUrl = '/admin/dashboard';
                if (role === 'quan_tri_vien') redirectUrl = '/admin/dashboard-admin'; // Sẽ tạo route này sau

                navigate(redirectUrl);
                window.location.reload();
            } else {
                toast.error('Lỗi từ server debug: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối đến server debug.');
        }
    };

    return (
        <div className="bg-gray-800 text-white flex items-center justify-center min-h-screen">
            <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center text-gray-800">
                <h1 className="text-3xl font-bold">Công cụ Đăng nhập nhanh</h1>
                <p className="text-gray-600 mt-2 mb-8">Chọn vai trò để lấy token hợp lệ.</p>

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