import React from 'react';
import { Link } from 'react-router-dom'; // Dùng Link để điều hướng

function RegisterPage() {
    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-10 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký tài khoản</h1>
                    <p className="text-gray-600 mb-8">Nhanh chóng trở thành thành viên để hưởng nhiều ưu đãi.</p>

                    <form id="register-form" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="ho-ten" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                <input type="text" name="ho-ten" id="ho-ten" placeholder="Nguyễn Văn A" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" id="email" placeholder="email@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="mat-khau" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                <input type="password" name="mat-khau" id="mat-khau" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="xac-nhan-mat-khau" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                <input type="password" name="xac-nhan-mat-khau" id="xac-nhan-mat-khau" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="dia-chi" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                            <input type="text" name="dia-chi" id="dia-chi" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="flex items-center">
                            <input id="dieu-khoan" name="dieu-khoan" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" required />
                            <label htmlFor="dieu-khoan" className="ml-2 block text-sm text-gray-900">
                                Tôi đồng ý với các <a href="#" className="font-medium text-blue-600 hover:text-blue-500">điều khoản dịch vụ</a>.
                            </label>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Đăng ký
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?
                            <Link to="/dang-nhap" className="font-medium text-blue-600 hover:text-blue-500">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;