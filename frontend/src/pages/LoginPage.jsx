import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    // Sử dụng useState để lưu trữ email và mật khẩu người dùng nhập vào
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Để lưu thông báo lỗi

    // Sử dụng useNavigate để điều hướng chương trình
    const navigate = useNavigate();

    // Hàm xử lý khi người dùng bấm nút Đăng nhập
    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn form tự gửi đi
        setError(null); // Xóa lỗi cũ

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, matKhau: password })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);

                // Lưu token và thông tin người dùng vào trình duyệt
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));

                // Dùng navigate để chuyển hướng về trang chủ
                navigate('/');
                window.location.reload(); // Tải lại trang để header và sidebar được cập nhật
            } else {
                // Nếu có lỗi, hiển thị lỗi đó
                setError(result.error);
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng thử lại.');
            console.error(err);
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email hoặc Tên tài khoản</label>
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

                        {/* Hiển thị thông báo lỗi nếu có */}
                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Ghi nhớ đăng nhập</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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