import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

// --- Component Modal Thêm Lô Hàng (Hoàn chỉnh) ---
function AddBatchModal({ isOpen, onClose, productId, onBatchAdded }) {
    const [batchData, setBatchData] = useState({
        ma_lo_thuoc: '',
        so_luong_nhap: '',
        gia_nhap: '',
        ngay_san_xuat: '',
        han_su_dung: '',
        vi_tri_kho: '',
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setBatchData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3000/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...batchData, id_san_pham: productId })
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                onBatchAdded(); // Gọi hàm để tải lại dữ liệu và đóng modal
            } else {
                setError(result.error || 'Đã có lỗi xảy ra.');
            }
        } catch (err) {
            setError('Lỗi kết nối đến server.');
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
                        <div><label htmlFor="gia_nhap" className="block text-sm font-medium">Giá nhập</label><input type="number" name="gia_nhap" value={batchData.gia_nhap} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="vi_tri_kho" className="block text-sm font-medium">Vị trí trong kho</label><input type="text" name="vi_tri_kho" value={batchData.vi_tri_kho} onChange={handleChange} placeholder="Ví dụ: Kệ A1, Hàng 2" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="ngay_san_xuat" className="block text-sm font-medium">Ngày sản xuất</label><input type="date" name="ngay_san_xuat" value={batchData.ngay_san_xuat} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-500" /></div>
                        <div><label htmlFor="han_su_dung" className="block text-sm font-medium">Hạn dùng</label><input type="date" name="han_su_dung" value={batchData.han_su_dung} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-500" /></div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="pt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Hủy bỏ</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Thêm lô</button>
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

    const fetchProductDetail = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3000/api/products/${id}`);
            if (!response.ok) throw new Error('Không tìm thấy sản phẩm');
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    const handleBatchAdded = () => {
        setIsModalOpen(false); // Đóng modal
        fetchProductDetail(); // Tải lại dữ liệu để cập nhật
    };

    if (isLoading) return <div className="p-8">Đang tải chi tiết sản phẩm...</div>;
    if (!product) return <div className="p-8">Không tìm thấy thông tin sản phẩm.</div>;

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

            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1"><img src={product.hinh_anh} alt={product.ten_thuoc} className="w-full h-auto object-cover rounded-lg shadow-md aspect-square" /></div>
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin chung</h2>
                        <dl className="space-y-4">
                            <div><dt className="text-sm font-medium text-gray-500">Mã thuốc (SKU)</dt><dd className="mt-1 font-semibold text-gray-900">{product.ma_thuoc}</dd></div>
                            <div><dt className="text-sm font-medium text-gray-500">Danh mục</dt><dd className="mt-1 font-semibold text-gray-900">{product.danh_muc}</dd></div>
                            <div><dt className="text-sm font-medium text-gray-500">Giá bán</dt><dd className="mt-1 font-semibold text-gray-900">{Number(product.gia_ban).toLocaleString('vi-VN')}đ / {product.don_vi_tinh}</dd></div>
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
                            {product.batches?.map(batch => (
                                <tr key={batch.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{batch.ma_lo_thuoc}</td>
                                    <td className="px-6 py-4 font-semibold">{batch.so_luong_con}</td>
                                    <td className="px-6 py-4">{new Date(batch.ngay_san_xuat).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4 font-medium">{new Date(batch.han_su_dung).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">{batch.vi_tri_kho}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddBatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productId={product.id} onBatchAdded={handleBatchAdded} />
        </>
    );
}

export default ProductDetailAdminPage;