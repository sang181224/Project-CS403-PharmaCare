import React from 'react';
import { Link } from 'react-router-dom';

function AddProductPage() {
    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex space-x-2">
                        <li className="flex items-center"><Link to="/admin/kho" className="text-gray-500 hover:text-blue-600">Quản lý Kho</Link></li>
                        <li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Thêm sản phẩm mới</span></li>
                    </ol>
                </nav>
                <h1 className="text-3xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
                <p className="text-gray-600 mt-1">Nhập thông tin chi tiết cho sản phẩm và lô hàng đầu tiên.</p>
            </div>

            <form action="#" method="POST">
                <div className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                    {/* Basic Info */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Thông tin cơ bản</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div><label htmlFor="ten-thuoc" className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc</label><input type="text" id="ten-thuoc" className="w-full px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="ma-thuoc" className="block text-sm font-medium text-gray-700 mb-1">Mã thuốc (SKU)</label><input type="text" id="ma-thuoc" className="w-full px-4 py-2 border rounded-lg" /></div>
                            <div className="md:col-span-2"><label htmlFor="mo-ta" className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label><textarea id="mo-ta" rows="3" className="w-full px-4 py-2 border rounded-lg"></textarea></div>
                            <div><label htmlFor="danh-muc" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label><select id="danh-muc" className="w-full px-4 py-2 border rounded-lg"><option>Thuốc giảm đau</option><option>Thuốc kháng sinh</option></select></div>
                            <div><label htmlFor="nha-san-xuat" className="block text-sm font-medium text-gray-700 mb-1">Nhà sản xuất</label><select id="nha-san-xuat" className="w-full px-4 py-2 border rounded-lg"><option>Traphaco</option><option>DHG Pharma</option></select></div>
                            <div><label htmlFor="don-vi-tinh" className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label><input type="text" id="don-vi-tinh" placeholder="Hộp, Vỉ, Viên..." className="w-full px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="gia-ban" className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label><input type="number" id="gia-ban" className="w-full px-4 py-2 border rounded-lg" /></div>
                        </div>
                    </div>

                    {/* First Batch Info */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Thông tin lô hàng nhập đầu tiên</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div><label htmlFor="ma-lo" className="block text-sm font-medium text-gray-700 mb-1">Mã lô</label><input type="text" id="ma-lo" className="w-full px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="so-luong-nhap" className="block text-sm font-medium text-gray-700 mb-1">Số lượng nhập</label><input type="number" id="so-luong-nhap" className="w-full px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="gia-nhap" className="block text-sm font-medium text-gray-700 mb-1">Giá nhập / đơn vị (VNĐ)</label><input type="number" id="gia-nhap" className="w-full px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="han-su-dung" className="block text-sm font-medium text-gray-700 mb-1">Hạn sử dụng</label><input type="date" id="han-su-dung" className="w-full px-4 py-2 border rounded-lg text-gray-500" /></div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t flex justify-end space-x-4">
                        <Link to="/admin/kho" className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy bỏ</Link>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Lưu sản phẩm</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default AddProductPage;