import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth để dùng context

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm login từ context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`/api/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, matKhau: password })
            });

            const result = await response.json();

            if (response.ok) {
                // Dùng hàm login từ context để cập nhật trạng thái toàn cục
                login(result.user, result.token);

                // Chuyển hướng theo vai trò
                if (result.user.vaiTro === 'quan_tri_vien') {
                    navigate('/admin/dashboard-admin');
                } else if (result.user.vaiTro === 'nhan_vien' || result.user.vaiTro === 'quan_ly_kho') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
                window.location.reload(); // Tải lại để toàn bộ app cập nhật trạng thái mới
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Lỗi kết nối hoặc server không phản hồi.');
        }
    };

    return (
        <div className="p-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="bg-white p-10 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng trở lại!</h1>
                        <p className="text-gray-600 mb-8">Đăng nhập để tiếp tục.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Ghi nhớ tôi</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700">
                                Đăng nhập
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Chưa có tài khoản?
                            <Link to="/dang-ky" className="font-medium text-blue-600 hover:text-blue-500">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;