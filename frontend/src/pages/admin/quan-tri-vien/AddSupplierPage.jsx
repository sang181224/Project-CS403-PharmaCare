import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddSupplierPage() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thêm nhà cung cấp mới thành công!');
        navigate('/admin/nha-cung-cap'); // Quay về trang danh sách
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-8">
                <nav className="text-sm mb-2" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex space-x-2">
                        <li className="flex items-center">
                            <Link to="/admin/nha-cung-cap" className="text-gray-500 hover:text-purple-600">Quản lý Nhà cung cấp</Link>
                        </li>
                        <li className="flex items-center">
                            <i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i>
                            <span className="text-gray-800 font-medium">Thêm nhà cung cấp</span>
                        </li>
                    </ol>
                </nav>
                <h1 className="text-3xl font-bold text-gray-800">Thêm nhà cung cấp mới</h1>
            </div>

            {/* Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="ten-ncc" className="block text-sm font-medium text-gray-700">Tên Nhà cung cấp</label>
                        <input type="text" id="ten-ncc" className="w-full mt-1 px-4 py-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label htmlFor="dia-chi" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input type="text" id="dia-chi" className="w-full mt-1 px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nguoi-lien-lac" className="block text-sm font-medium text-gray-700">Người liên lạc</label>
                            <input type="text" id="nguoi-lien-lac" className="w-full mt-1 px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="so-dien-thoai" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input type="tel" id="so-dien-thoai" className="w-full mt-1 px-4 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" className="w-full mt-1 px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/nha-cung-cap" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            Hủy bỏ
                        </Link>
                        <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700">
                            Lưu nhà cung cấp
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddSupplierPage;