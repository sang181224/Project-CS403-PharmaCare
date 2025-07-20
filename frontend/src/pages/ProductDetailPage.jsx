import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

// Component con cho các Tab
const InfoTab = ({ title, content }) => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <div className="prose max-w-none text-gray-600">
            <p>{content || 'Thông tin đang được cập nhật.'}</p>
        </div>
    </div>
);


function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chi_dinh'); // Tab mặc định
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/products/${id}`);
                const data = await response.json();
                if (response.ok) setProduct(data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setIsLoading(false);
            }
        };
        window.scrollTo(0, 0); // Tự động cuộn lên đầu trang
        fetchProduct();
    }, [id]);

    if (isLoading) return <div className="p-8 text-center">Đang tải...</div>;
    if (!product) return <div className="p-8 text-center">Không tìm thấy sản phẩm.</div>;

    const tabs = [
        { id: 'chi_dinh', title: 'Chỉ định', content: product.chi_dinh },
        { id: 'cach_dung', title: 'Cách dùng - Liều dùng', content: product.cach_dung },
        { id: 'thanh_phan', title: 'Thành phần', content: product.thanh_phan },
        { id: 'tac_dung_phu', title: 'Tác dụng phụ', content: product.tac_dung_phu },
        { id: 'chong_chi_dinh', title: 'Chống chỉ định', content: product.chong_chi_dinh },
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* Cột ảnh */}
                        <div className="sticky top-24">
                            <div className="relative group overflow-hidden rounded-xl">
                                <img
                                    src={product.hinh_anh}
                                    alt={product.ten_thuoc}
                                    className="w-full h-auto object-contain bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 group-hover:shadow-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            </div>
                        </div>

                        {/* Cột thông tin */}
                        <div className="space-y-6">
                            <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 uppercase tracking-wide">
                                    {product.danh_muc}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 leading-tight">
                                    {product.ten_thuoc}
                                </h1>
                                <p className="text-gray-600 mt-3 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Nhà sản xuất: <span className="font-medium ml-1">{product.nha_san_xuat}</span>
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                <p className="text-sm text-blue-600 font-medium mb-1">Giá bán</p>
                                <p className="text-4xl font-bold text-blue-700">
                                    {Number(product.gia_ban).toLocaleString('vi-VN')}đ
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.mo_ta || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                                </p>
                            </div>

                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.so_luong_ton === 0}
                                className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${product.so_luong_ton > 0
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                        : 'bg-gray-400 text-white cursor-not-allowed'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
                                {product.so_luong_ton > 0 ? 'Thêm vào giỏ hàng' : 'Đã hết hàng'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Khu vực thông tin chi tiết dạng Tab */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-8">
                    <div className="border-b border-gray-200 mb-8">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap py-4 px-2 border-b-3 font-semibold text-sm transition-all duration-300 relative ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.title}
                                    {activeTab === tab.id && (
                                        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="min-h-[200px]">
                        {tabs.map(tab => activeTab === tab.id && (
                            <div key={tab.id} className="animate-fade-in">
                                <InfoTab title={tab.title} content={tab.content} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;