import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddEmployeePage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Tạo tài khoản nhân viên mới thành công!');
        navigate('/admin/nhan-vien'); // Quay về trang danh sách
    };

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/nhan-vien" className="text-gray-500 hover:text-purple-600">Quản lý Nhân viên</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Thêm nhân viên mới</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Tạo tài khoản nhân viên mới</h1>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="ho-ten" className="block text-sm font-medium">Họ và tên</label><input type="text" id="ho-ten" className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input type="email" id="email" className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                    </div>
                    <div><label htmlFor="vai-tro" className="block text-sm font-medium">Vai trò</label><select id="vai-tro" className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Nhân viên bán hàng</option><option>Quản lý kho</option></select></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="mat-khau" className="block text-sm font-medium">Mật khẩu</label><input type="password" id="mat-khau" className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        <div><label htmlFor="xac-nhan-mat-khau" className="block text-sm font-medium">Xác nhận mật khẩu</label><input type="password" id="xac-nhan-mat-khau" className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/nhan-vien" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Tạo tài khoản</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddEmployeePage;