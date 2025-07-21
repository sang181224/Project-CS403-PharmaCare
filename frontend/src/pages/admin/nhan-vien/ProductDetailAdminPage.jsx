import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

// --- Component Modal Thêm Lô Hàng ---
function AddBatchModal({ isOpen, onClose, productId, onBatchAdded }) {
    if (!isOpen) return null;

    const [batchData, setBatchData] = useState({
        ma_lo_thuoc: '',
        so_luong_nhap: '',
        don_gia_nhap: '',
        ngay_san_xuat: '',
        han_su_dung: '',
        vi_tri_kho: '',
    });

    const handleChange = (e) => {
        setBatchData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/batches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...batchData, id_san_pham: productId })
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                onBatchAdded();
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            toast.error('Lỗi kết nối.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Thêm lô hàng mới</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label htmlFor="ma_lo_thuoc" className="block text-sm font-medium">Mã lô</label><input type="text" name="ma_lo_thuoc" value={batchData.ma_lo_thuoc} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        <div><label htmlFor="so_luong_nhap" className="block text-sm font-medium">Số lượng nhập</label><input type="number" name="so_luong_nhap" value={batchData.so_luong_nhap} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" required /></div>
                        <div><label htmlFor="don_gia_nhap" className="block text-sm font-medium">Giá nhập</label><input type="number" name="don_gia_nhap" value={batchData.don_gia_nhap} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="vi_tri_kho" className="block text-sm font-medium">Vị trí trong kho</label><input type="text" name="vi_tri_kho" value={batchData.vi_tri_kho} onChange={handleChange} placeholder="Ví dụ: Kệ A1" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="ngay_san_xuat" className="block text-sm font-medium">Ngày sản xuất</label><input type="date" name="ngay_san_xuat" value={batchData.ngay_san_xuat} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="han_su_dung" className="block text-sm font-medium">Hạn dùng</label><input type="date" name="han_su_dung" value={batchData.han_su_dung} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                    </div>
                    <div className="pt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy bỏ</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Thêm lô</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- Component Trang Chi Tiết Sản Phẩm ---
function ProductDetailAdminPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProductDetail = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            // SỬA LẠI ĐƯỜNG DẪN API Ở ĐÂY: Dùng API được bảo vệ '/api/products/:id'
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Không thể tải dữ liệu sản phẩm.');
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProductDetail();
    }, [fetchProductDetail]);

    const handleBatchAdded = () => {
        setIsModalOpen(false);
        fetchProductDetail(); // Tải lại dữ liệu để cập nhật danh sách lô
    };

    if (isLoading) return <div className="p-8 text-center">Đang tải chi tiết sản phẩm...</div>;
    if (!product) return <div className="p-8 text-center">Không tìm thấy thông tin sản phẩm.</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <nav className="text-sm mb-2"><ol className="list-none p-0 inline-flex space-x-2"><li><Link to="/admin/kho" className="text-gray-500 hover:text-blue-600">Quản lý Kho</Link></li><li><i className="fas fa-chevron-right text-xs text-gray-400 mx-2"></i><span className="text-gray-800 font-medium">{product.ten_thuoc}</span></li></ol></nav>
                    <h1 className="text-3xl font-bold text-gray-800">{product.ten_thuoc}</h1>
                </div>
                <Link to={`/admin/kho/sua/${product.id}`} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50">
                    <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />Sửa thông tin
                </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="relative group overflow-hidden rounded-lg">
                            <img
                                src={product.hinh_anh}
                                alt={product.ten_thuoc}
                                className="w-full h-64 md:h-72 object-contain bg-white rounded-lg shadow-md border border-gray-100 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                            Thông tin chung
                        </h2>
                        <dl className="space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 pb-4">
                                <dt className="text-sm font-medium text-gray-500 sm:w-32 mb-1 sm:mb-0">Mã thuốc (SKU)</dt>
                                <dd className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-md inline-block">{product.ma_thuoc}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-100 pb-4">
                                <dt className="text-sm font-medium text-gray-500 sm:w-32 mb-1 sm:mb-0">Danh mục</dt>
                                <dd className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block">{product.danh_muc}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <dt className="text-sm font-medium text-gray-500 sm:w-32 mb-1 sm:mb-0">Giá bán</dt>
                                <dd className="font-bold text-lg text-green-600 bg-green-50 px-3 py-2 rounded-md inline-block">
                                    {Number(product.gia_ban).toLocaleString('vi-VN')}đ / {product.don_vi_tinh}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Các lô hàng trong kho (Tổng tồn: {product.so_luong_ton || 0})</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"><FontAwesomeIcon icon={faPlus} className="mr-2" />Nhập lô mới</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm"><tr><th className="px-6 py-3">Mã Lô</th><th className="px-6 py-3">SL Tồn</th><th className="px-6 py-3">Ngày SX</th><th className="px-6 py-3">Hạn Dùng</th><th className="px-6 py-3">Vị trí</th></tr></thead>
                        <tbody>
                            {product.batches && product.batches.length > 0 ? (
                                product.batches.map(batch => (
                                    <tr key={batch.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{batch.ma_lo_thuoc}</td>
                                        <td className="px-6 py-4 font-semibold">{batch.so_luong_con}</td>
                                        <td className="px-6 py-4">{batch.ngay_san_xuat ? new Date(batch.ngay_san_xuat).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                        <td className="px-6 py-4 font-medium">{batch.han_su_dung ? new Date(batch.han_su_dung).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                        <td className="px-6 py-4">{batch.vi_tri_kho || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center p-8 text-gray-500">Sản phẩm này chưa có lô hàng nào trong kho.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddBatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productId={product.id} onBatchAdded={handleBatchAdded} />
        </>
    );
}

export default ProductDetailAdminPage;