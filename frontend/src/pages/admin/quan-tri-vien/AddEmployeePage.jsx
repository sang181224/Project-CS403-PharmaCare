import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddEmployeePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hoTen: '', email: '', matKhau: '', xacNhanMatKhau: '', vaiTro: 'nhan_vien'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.matKhau !== formData.xacNhanMatKhau) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/admin/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                navigate('/admin/nhan-vien');
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error) {
            alert('Lỗi kết nối đến server.');
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tạo tài khoản nhân viên mới</h1>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... form fields ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="hoTen" className="block text-sm font-medium">Họ và tên</label><input type="text" name="hoTen" id="hoTen" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
                        <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input type="email" name="email" id="email" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
                    </div>
                    <div><label htmlFor="vaiTro" className="block text-sm font-medium">Vai trò</label><select name="vaiTro" id="vaiTro" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg"><option value="nhan_vien">Nhân viên bán hàng</option><option value="quan_ly_kho">Quản lý kho</option></select></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="matKhau" className="block text-sm font-medium">Mật khẩu</label><input type="password" name="matKhau" id="matKhau" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
                        <div><label htmlFor="xacNhanMatKhau" className="block text-sm font-medium">Xác nhận mật khẩu</label><input type="password" name="xacNhanMatKhau" id="xacNhanMatKhau" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/nhan-vien" className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Tạo tài khoản</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddEmployeePage;