import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddSupplierPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ten_nha_cung_cap: '',
        dia_chi: '',
        so_dien_thoai: '',
        email: '',
        nguoi_lien_lac: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/admin/suppliers', {
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
                navigate('/admin/nha-cung-cap');
            } else {
                alert('Lỗi: ' + result.error);
            }
        } catch (error) {
            alert('Lỗi kết nối đến server.');
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Thêm Nhà cung cấp mới</h1>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div><label htmlFor="ten_nha_cung_cap" className="block text-sm font-medium">Tên Nhà cung cấp</label><input type="text" name="ten_nha_cung_cap" id="ten_nha_cung_cap" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" required /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="nguoi_lien_lac" className="block text-sm font-medium">Người liên lạc</label><input type="text" name="nguoi_lien_lac" id="nguoi_lien_lac" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
                        <div><label htmlFor="so_dien_thoai" className="block text-sm font-medium">Số điện thoại</label><input type="tel" name="so_dien_thoai" id="so_dien_thoai" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
                    </div>
                    <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input type="email" name="email" id="email" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
                    <div><label htmlFor="dia_chi" className="block text-sm font-medium">Địa chỉ</label><textarea name="dia_chi" id="dia_chi" onChange={handleChange} rows="3" className="w-full mt-1 p-2 border rounded-lg"></textarea></div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/nha-cung-cap" className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Hủy bỏ</Link>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Lưu Nhà cung cấp</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddSupplierPage;