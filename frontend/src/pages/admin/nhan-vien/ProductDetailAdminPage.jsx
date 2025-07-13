import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

// --- Component Modal Thêm Lô Hàng ---
function AddBatchModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Thêm lô hàng mới</h3>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label htmlFor="ma-lo" className="block text-sm font-medium">Mã lô</label><input type="text" id="ma-lo" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="so-luong" className="block text-sm font-medium">Số lượng</label><input type="number" id="so-luong" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="gia-nhap" className="block text-sm font-medium">Giá nhập</label><input type="number" id="gia-nhap" className="w-full mt-1 px-4 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="han-dung" className="block text-sm font-medium">Hạn dùng</label><input type="date" id="han-dung" className="w-full mt-1 px-4 py-2 border rounded-lg text-gray-500" /></div>
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

    useEffect(() => {
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
        fetchProductDetail();
    }, [id]);

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

            {/* === PHẦN ĐƯỢC CẬP NHẬT === */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cột ảnh */}
                    <div className="md:col-span-1">
                        <img src={product.hinh_anh} alt={product.ten_thuoc} className="w-full h-auto object-cover rounded-lg shadow-md aspect-square" />
                    </div>
                    {/* Cột thông tin */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin chung</h2>
                        <dl className="space-y-4">
                            <div><dt className="text-sm font-medium text-gray-500">Mã thuốc (SKU)</dt><dd className="mt-1 font-semibold text-gray-900">{product.ma_thuoc}</dd></div>
                            <div><dt className="text-sm font-medium text-gray-500">Danh mục</dt><dd className="mt-1 font-semibold text-gray-900">{product.danh_muc}</dd></div>
                            <div><dt className="text-sm font-medium text-gray-500">Giá bán</dt><dd className="mt-1 font-semibold text-gray-900">{Number(product.gia_ban).toLocaleString('vi-VN')}đ / {product.don_vi_tinh}</dd></div>
                            <div><dt className="text-sm font-medium text-gray-500">Mô tả</dt><dd className="mt-1 text-gray-800">{product.mo_ta}</dd></div>
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
                        <thead className="bg-gray-50 text-sm"><tr><th className="px-6 py-3">Mã Lô</th><th className="px-6 py-3">SL Tồn</th><th className="px-6 py-3">Hạn Dùng</th></tr></thead>
                        <tbody>
                            {product.batches?.map(batch => (
                                <tr key={batch.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{batch.ma_lo_thuoc}</td>
                                    <td className="px-6 py-4 font-semibold">{batch.so_luong_con}</td>
                                    <td className="px-6 py-4 font-medium">{new Date(batch.han_su_dung).toLocaleDateString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddBatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

export default ProductDetailAdminPage;