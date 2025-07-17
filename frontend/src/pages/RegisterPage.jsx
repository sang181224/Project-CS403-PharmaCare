import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        matKhau: '',
        xacNhanMatKhau: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.matKhau !== formData.xacNhanMatKhau) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hoTen: formData.hoTen, email: formData.email, matKhau: formData.matKhau })
            });
            const result = await response.json();
            if (response.ok) {
                setSuccess('Đăng ký thành công! Sẽ chuyển đến trang đăng nhập sau 3 giây.');
                setTimeout(() => navigate('/dang-nhap'), 3000);
            } else {
                setError(result.error || 'Đã có lỗi xảy ra.');
            }
        } catch (err) {
            setError('Không thể kết nối đến server.');
        }
    };

    return (
        <div className="p-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="bg-white p-10 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h1>
                        <p className="text-gray-600 mb-8">Nhanh chóng trở thành thành viên.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="hoTen" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input id="hoTen" name="hoTen" type="text" value={formData.hoTen} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ email</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="matKhau" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input id="matKhau" name="matKhau" type="password" value={formData.matKhau} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="xacNhanMatKhau" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                            <input id="xacNhanMatKhau" name="xacNhanMatKhau" type="password" value={formData.xacNhanMatKhau} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Đăng ký
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?
                            <Link to="/dang-nhap" className="font-medium text-blue-600 hover:text-blue-500"> Đăng nhập ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;