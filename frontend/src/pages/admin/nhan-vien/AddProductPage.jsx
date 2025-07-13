import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddProductPage() {
    const navigate = useNavigate();
    
    // Gộp tất cả state của form vào một object
    const [formData, setFormData] = useState({
        ten_thuoc: '',
        ma_thuoc: '',
        danh_muc: 'Thuốc giảm đau',
        nha_san_xuat: 'Traphaco',
        don_vi_tinh: 'Hộp',
        gia_ban: '',
        mo_ta: '',
        ma_lo: '',
        so_luong_nhap: '',
        gia_nhap: '',
        ngay_san_xuat: '',
        han_su_dung: '',
        vi_tri_kho: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (imageFile) {
            data.append('hinh_anh', imageFile);
        }

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                navigate('/admin/kho');
            } else {
                setError(result.error || 'Đã có lỗi xảy ra.');
            }
        } catch (err) {
            setError('Lỗi kết nối đến server.');
            console.error(err);
        }
    };

    return (
        <>
            <div className="mb-8">
                <nav className="text-sm mb-2" aria-label="Breadcrumb"><ol className="list-none p-0 inline-flex space-x-2"><li className="flex items-center"><Link to="/admin/kho" className="text-gray-500 hover:text-blue-600">Quản lý Kho</Link></li><li className="flex items-center"><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">Thêm sản phẩm mới</span></li></ol></nav>
                <h1 className="text-3xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
                <p className="text-gray-600 mt-1">Nhập thông tin chi tiết cho sản phẩm và lô hàng đầu tiên.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                    {/* Basic Info */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Thông tin cơ bản</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div><label htmlFor="ten_thuoc" className="block text-sm font-medium">Tên thuốc</label><input type="text" id="ten_thuoc" name="ten_thuoc" value={formData.ten_thuoc} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                            <div><label htmlFor="ma_thuoc" className="block text-sm font-medium">Mã thuốc (SKU)</label><input type="text" id="ma_thuoc" name="ma_thuoc" value={formData.ma_thuoc} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                            <div className="md:col-span-2"><label htmlFor="mo_ta" className="block text-sm font-medium">Mô tả ngắn</label><textarea id="mo_ta" name="mo_ta" value={formData.mo_ta} onChange={handleChange} rows="3" className="w-full mt-1 px-4 py-2 border rounded-lg"></textarea></div>
                            <div><label htmlFor="danh_muc" className="block text-sm font-medium">Danh mục</label><select id="danh_muc" name="danh_muc" value={formData.danh_muc} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Thuốc giảm đau</option><option>Thuốc kháng sinh</option></select></div>
                            <div><label htmlFor="nha_san_xuat" className="block text-sm font-medium">Nhà sản xuất</label><select id="nha_san_xuat" name="nha_san_xuat" value={formData.nha_san_xuat} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg"><option>Traphaco</option><option>DHG Pharma</option></select></div>
                            <div><label htmlFor="don_vi_tinh" className="block text-sm font-medium">Đơn vị tính</label><input type="text" id="don_vi_tinh" name="don_vi_tinh" value={formData.don_vi_tinh} onChange={handleChange} placeholder="Hộp, Vỉ, Viên..." className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="gia_ban" className="block text-sm font-medium">Giá bán (VNĐ)</label><input type="number" id="gia_ban" name="gia_ban" value={formData.gia_ban} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        </div>
                    </div>

                    {/* First Batch Info */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Thông tin lô hàng nhập đầu tiên</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div><label htmlFor="ma_lo" className="block text-sm font-medium">Mã lô</label><input type="text" id="ma_lo" name="ma_lo" value={formData.ma_lo} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                            <div><label htmlFor="so_luong_nhap" className="block text-sm font-medium">Số lượng nhập</label><input type="number" id="so_luong_nhap" name="so_luong_nhap" value={formData.so_luong_nhap} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                            <div><label htmlFor="gia_nhap" className="block text-sm font-medium">Giá nhập / đơn vị (VNĐ)</label><input type="number" id="gia_nhap" name="gia_nhap" value={formData.gia_nhap} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="vi_tri_kho" className="block text-sm font-medium">Vị trí trong kho</label><input type="text" id="vi_tri_kho" name="vi_tri_kho" value={formData.vi_tri_kho} onChange={handleChange} placeholder="Kệ A, Hàng 2" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                            <div><label htmlFor="ngay_san_xuat" className="block text-sm font-medium">Ngày sản xuất</label><input type="date" id="ngay_san_xuat" name="ngay_san_xuat" value={formData.ngay_san_xuat} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-500" /></div>
                            <div><label htmlFor="han_su_dung" className="block text-sm font-medium">Hạn sử dụng</label><input type="date" id="han_su_dung" name="han_su_dung" value={formData.han_su_dung} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-500" /></div>
                        </div>
                    </div>
                    
                    <div>
                         <label htmlFor="hinh_anh" className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>
                         <input type="file" name="hinh_anh" id="hinh_anh" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    
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