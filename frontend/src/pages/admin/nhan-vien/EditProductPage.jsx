import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Dữ liệu mẫu
const productData = {
    id: 'PARA500',
    name: 'Paracetamol 500mg',
    description: 'Thuốc giảm đau, hạ sốt hiệu quả.',
    category: 'Thuốc giảm đau',
    manufacturer: 'Traphaco',
    unit: 'Hộp',
    price: 15000,
};

function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({ ...productData }); // Giả lập dữ liệu đã được fetch

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dữ liệu cập nhật:', product);
        alert('Cập nhật sản phẩm thành công!');
        navigate('/admin/kho'); // Quay về trang danh sách
    };

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/kho" className="text-gray-500 hover:text-blue-600">Quản lý Kho</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Sửa sản phẩm</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Sửa thông tin sản phẩm</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="name" className="block text-sm font-medium">Tên thuốc</label><input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="id" className="block text-sm font-medium">Mã thuốc (SKU)</label><input type="text" id="id" name="id" value={product.id} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-200" readOnly /></div>
                        <div className="md:col-span-2"><label htmlFor="description" className="block text-sm font-medium">Mô tả ngắn</label><textarea id="description" name="description" value={product.description} onChange={handleChange} rows="3" className="w-full mt-1 px-4 py-2 border rounded-lg"></textarea></div>
                        <div><label htmlFor="category" className="block text-sm font-medium">Danh mục</label><select id="category" name="category" value={product.category} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Thuốc giảm đau</option><option>Thuốc kháng sinh</option></select></div>
                        <div><label htmlFor="manufacturer" className="block text-sm font-medium">Nhà sản xuất</label><select id="manufacturer" name="manufacturer" value={product.manufacturer} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Traphaco</option><option>DHG Pharma</option></select></div>
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/kho" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy bỏ</Link>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu thay đổi</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default EditProductPage;